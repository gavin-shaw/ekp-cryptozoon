import {
  CacheService,
  ClientService,
  ClientStateChangedEvent,
  collection,
  CurrencyDto,
  EkDocument,
  filterPath,
  LayerDto,
  LimiterService,
  logger,
  parseCurrency,
  PriceService,
} from '@earnkeeper/ekp-sdk-nestjs';
import { Injectable } from '@nestjs/common';
import Bottleneck from 'bottleneck';
import { ethers } from 'ethers';
import _ from 'lodash';
import moment from 'moment';
import { filter } from 'rxjs';
import { YAG_CONTRACT_ADDRESS } from 'src/util';
import { ContractService } from '../contract/contract.service';
import { ZOON_CONTRACT_ADDRESS } from '../util/constants';
import { MarketListingDocument } from './market-listing.document';

const FILTER_PATH = '/plugin/cryptozoon/marketplace';
const COLLECTION_NAME = collection(MarketListingDocument);
const MARKET_PAGE_SIZE = 400;

@Injectable()
export class MarketplaceService {
  private readonly marketMutex: Bottleneck;

  constructor(
    private clientService: ClientService,
    private contractService: ContractService,
    private cacheService: CacheService,
    private priceService: PriceService,
    limiterService: LimiterService,
  ) {
    this.marketMutex = limiterService.createMutex(`cryptozoon-market`);

    this.clientService.clientStateEvents$
      .pipe(filter((event) => filterPath(event, FILTER_PATH)))
      .subscribe((event) => {
        this.handleClientStateEvent(event);
      });
  }

  async handleClientStateEvent(
    clientStateChangedEvent: ClientStateChangedEvent,
  ) {
    await this.clientService.emitBusy(clientStateChangedEvent, COLLECTION_NAME);

    const currency = parseCurrency(clientStateChangedEvent);

    const yagPrices = await this.priceService.dailyFiatPricesOf(
      'bsc',
      YAG_CONTRACT_ADDRESS,
      currency.id,
    );

    const zoonPrices = await this.priceService.dailyFiatPricesOf(
      'bsc',
      ZOON_CONTRACT_ADDRESS,
      currency.id,
    );

    const yagPrice = _.chain(yagPrices).maxBy('timestamp').get('price').value();
    const zoonPrice = _.chain(zoonPrices)
      .maxBy('timestamp')
      .get('price')
      .value();

    const documents = await this.getMarketListings(
      yagPrice,
      zoonPrice,
      currency,
    );

    await this.emitDocuments(
      clientStateChangedEvent,
      COLLECTION_NAME,
      documents,
    );

    await this.clientService.emitDone(clientStateChangedEvent, COLLECTION_NAME);
  }

  async emitDocuments(
    clientEvent: ClientStateChangedEvent,
    collectionName: string,
    documents: EkDocument[],
  ) {
    const addLayers: LayerDto[] = [
      {
        id: collectionName,
        collectionName,
        set: documents,
        tags: [collectionName],
        timestamp: moment().unix(),
      },
    ];
    await this.clientService.addLayers(clientEvent.clientId, addLayers);
  }

  async getMarketListings(
    yagPrice: number,
    zoonPrice: number,
    currency: CurrencyDto,
  ): Promise<MarketListingDocument[]> {
    const debugKey = 'fetchMarketListings()';
    const cacheKey = `${debugKey}_v1`;

    return this.marketMutex.schedule(async () => {
      return this.cacheService.wrap(
        cacheKey,
        async () => {
          logger.debug('Fetching market listings');

          const count = await this.contractService.getMarketListingCount();

          const nowMoment = moment();

          const listings = await _.chain(_.range(0, count, MARKET_PAGE_SIZE))
            .map(async (offset) => {
              const pageSize =
                count - offset < MARKET_PAGE_SIZE
                  ? count - offset
                  : MARKET_PAGE_SIZE;

              const tokenIds = await this.contractService.getMarketTokenIds(
                offset,
                pageSize,
              );

              const [zoans, saleDetails] = await Promise.all([
                this.contractService.getZoanDetails(tokenIds),
                this.contractService.getSaleDetails(tokenIds),
              ]);

              return tokenIds
                .map((tokenId, i) => {
                  const price = Number(
                    ethers.utils.formatEther(
                      ethers.BigNumber.from('0x' + saleDetails[i].details[2]),
                    ),
                  );

                  if (!price || price > 1000000000) {
                    return undefined;
                  }

                  const zoan = zoans[i];

                  const yagReward = this.contractService.getRewardPerDays(
                    zoan,
                    1,
                  );
                  const priceFiat = price * zoonPrice;
                  const yagRewardFiat = yagReward * yagPrice;
                  const roiDays = Math.ceil(priceFiat / yagRewardFiat);
                  const apr = 365 / roiDays;

                  const document: MarketListingDocument = {
                    ...zoan,
                    apr,
                    fiatSymbol: currency.symbol,
                    owner: saleDetails[i].details[1].substring(24),
                    price,
                    priceFiat,
                    roiDays,
                    timestamp: ethers.BigNumber.from(
                      '0x' + saleDetails[i].details[4],
                    ).toNumber(),
                    updated: nowMoment.unix(),
                    yagReward,
                  };

                  return document;
                })
                .filter((it) => !!it);
            })
            .thru((promises) => Promise.all(promises))
            .value();

          return _.chain(listings)
            .flatten()
            .sortBy('timestamp')
            .reverse()
            .value();
        },
        {
          ttl: 15,
        },
      );
    });
  }
}
