import { EkDocument } from '@earnkeeper/ekp-sdk-nestjs';

export class MarketListingDocument extends EkDocument {
  constructor(properties: MarketListingDocument) {
    super(properties);
  }

  readonly apr: number;
  readonly clazz: string;
  readonly exp: number;
  readonly fiatSymbol: string;
  readonly imageUrl: string;
  readonly level: number;
  readonly owner: number;
  readonly price: number;
  readonly priceFiat: number;
  readonly rare: number;
  readonly roiDays: number;
  readonly timestamp: number;
  readonly tokenId: string;
  readonly tribe: string;
  readonly updated: number;
  readonly yagReward: number;
  readonly zoanType: string;
}
