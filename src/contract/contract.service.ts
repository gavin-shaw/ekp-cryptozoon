import { EthersService } from '@earnkeeper/ekp-sdk-nestjs';
import { Injectable } from '@nestjs/common';
import { validate } from 'bycontract';
import { ethers } from 'ethers';
import { Zoan } from '../model';
import {
  EXP_PER_WIN,
  FIGHTS_PER_DAY,
  getClazz,
  getImageUrl,
  getLevel,
  getRarity,
  getTribe,
  LEVELS_TABLE,
  NORMAL_ZOAN,
  padNumber,
  REWARDS_TABLE,
  SUPER_ZOAN,
  WIN_RATE,
} from '../util';

@Injectable()
export class ContractService {
  constructor(private ethersService: EthersService) {}

  getRewardPerDays(zoan: Zoan, days: number): number {
    if (zoan.level === 6) {
      return (
        zoan.rare *
        FIGHTS_PER_DAY *
        WIN_RATE *
        this.getReward(zoan.rare, zoan.level, zoan.zoanType) *
        days
      );
    }

    let runningexp = zoan.exp;
    let yagReward = 0;
    for (let hour = 0; hour < 24 * days; hour += 24 / FIGHTS_PER_DAY) {
      const periodYagReward =
        zoan.rare *
        WIN_RATE *
        this.getReward(zoan.rare, getLevel(runningexp), zoan.zoanType);

      yagReward += periodYagReward;
      runningexp += zoan.rare * EXP_PER_WIN * WIN_RATE;
    }
    return yagReward;
  }

  getReward(rare: number, level: number, type: string): number {
    validate([rare, level, type], ['number', 'number', 'string']);

    let reward = REWARDS_TABLE[rare - 1][level - 1];

    if (type === SUPER_ZOAN) {
      reward *= 1.2;
    }

    return reward;
  }

  getLevel(exp: number) {
    for (let i = 0; i < LEVELS_TABLE.length; i++) {
      if (exp < LEVELS_TABLE[i]) {
        return i + 1;
      }
    }
    return LEVELS_TABLE.length + 1;
  }

  async getSaleDetails(tokenIds: string[]) {
    validate([tokenIds], ['Array.<number>']);

    const count = tokenIds.length;
    let i: number;

    const to = '0x956bbc80253755a48fbccc6783bbb418c793a257';

    const dataLines = ['0x252dba42', padNumber(32, 64), padNumber(count, 64)];

    for (i = 0; i < count; i++) {
      dataLines.push(padNumber(32 * count + i * 192, 64));
    }

    for (i = 0; i < count; i++) {
      dataLines.push(
        '000000000000000000000000f62b6a53a2cd03a61fe83db00087d20b3b51cf9c',
      );
      dataLines.push(padNumber(64, 64));
      dataLines.push(padNumber(68, 64));
      dataLines.push(
        '1e510eee00000000000000000000000000000000000000000000000000000000',
      );
      dataLines.push(padNumber(tokenIds[i], 8) + padNumber(0, 56));
      dataLines.push(
        '0000000000000000000000000000000000000000000000000000000000000000',
      );
    }

    const result = await this.ethersService.send('bsc', to, dataLines.join(''));

    const rspLines = result.match(/([0-9a-fA-F]{1,64})/g);

    const sales = [];

    for (i = 0; i < count; i++) {
      const sale = {
        id: tokenIds[i],
        details: [],
      };
      for (let j = 0; j < 6; j++) {
        sale.details.push(rspLines[count + 5 + j + i * 7]);
      }
      sales.push(sale);
    }

    return sales;
  }

  async getMarketTokenIds(offset: number, count: number) {
    let i: number;
    const to = '0x956bbc80253755a48fbccc6783bbb418c793a257';

    const dataLines = ['0x252dba42', padNumber(32, 64), padNumber(count, 64)];

    for (i = 0; i < count; i++) {
      dataLines.push(padNumber(32 * count + i * 160, 64));
    }

    for (i = 0; i < count; i++) {
      dataLines.push(
        '000000000000000000000000f62b6a53a2cd03a61fe83db00087d20b3b51cf9c',
      );
      dataLines.push(padNumber(64, 64));
      dataLines.push(padNumber(36, 64));
      dataLines.push(
        '598a4fc800000000000000000000000000000000000000000000000000000000',
      );
      dataLines.push(padNumber(offset + i, 8) + padNumber(0, 56));
    }

    const result = await this.ethersService.send('bsc', to, dataLines.join(''));

    const rspLines = result.match(/([0-9a-fA-F]{1,64})/g);

    const tokenIds = [];

    for (i = 0; i < count; i++) {
      tokenIds.push(
        ethers.BigNumber.from('0x' + rspLines[count + 5 + i * 2]).toNumber(),
      );
    }

    return tokenIds;
  }

  async getMarketListingCount() {
    const to = '0xf62b6a53a2cd03a61fe83db00087d20b3b51cf9c';
    const data = '0x9d443201';
    const result = await this.ethersService.send('bsc', to, data);
    return ethers.BigNumber.from(result).toNumber();
  }

  async getZoanDetails(tokenIds: string[]): Promise<Zoan[]> {
    validate(tokenIds, 'Array.<number>');

    const count = tokenIds.length;
    let i: number;
    const to = '0x956bbc80253755a48fbccc6783bbb418c793a257';

    const dataLines = ['0x252dba42', padNumber(32, 64), padNumber(count, 64)];

    for (i = 0; i < count; i++) {
      dataLines.push(padNumber(32 * count + i * 160, 64));
    }

    for (i = 0; i < count; i++) {
      dataLines.push(
        '0000000000000000000000008bbe571b381ee58dd8f2335a8f0a5b42e83bdcfa',
      );
      dataLines.push(padNumber(64, 64));
      dataLines.push(padNumber(36, 64));
      dataLines.push(
        '272ad29f00000000000000000000000000000000000000000000000000000000',
      );
      dataLines.push(padNumber(tokenIds[i], 8) + padNumber(0, 56));
    }

    const result = await this.ethersService.send('bsc', to, dataLines.join(''));

    const rspLines = result.match(/([0-9a-fA-F]{1,64})/g);

    const details = [];

    for (i = 0; i < count; i++) {
      const rawDetails = [];

      for (let j = 0; j < 5; j++) {
        rawDetails.push(rspLines[count + 5 + j + i * 7]);
      }

      const zoanType =
        ethers.BigNumber.from('0x' + rawDetails[1]).toNumber() === 1
          ? SUPER_ZOAN
          : NORMAL_ZOAN;
      const tokenId = tokenIds[i];
      const dna = '0x' + rawDetails[4];
      const rare = getRarity(dna);
      const exp = ethers.BigNumber.from('0x' + rawDetails[3]).toNumber() / 100;
      const level = getLevel(exp);
      const clazz = getClazz(dna, rare, zoanType);
      const imageUrl = getImageUrl(clazz, level);
      const tribe = getTribe(
        ethers.BigNumber.from('0x' + rawDetails[2]).toNumber(),
      );

      const item: Zoan = {
        zoanType,
        id: `${tokenId}`,
        tokenId,
        exp,
        tribe,
        rare,
        clazz,
        level,
        imageUrl,
      };
      details.push(item);
    }

    return details;
  }
}
