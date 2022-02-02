import { validate } from 'bycontract';
import { ethers } from 'ethers';
import { NORMAL_ZOAN, SUPER_ZOAN } from './constants';

export function getRarity(dna: string) {
  validate(dna, 'string');

  const dnaNum = ethers.BigNumber.from(dna)
    .div(Math.pow(10, 13))
    .div(Math.pow(10, 13))
    .toNumber();

  return dnaNum > 9999
    ? 1
    : dnaNum > 9707
    ? 6
    : dnaNum > 9359
    ? 5
    : dnaNum > 8706
    ? 4
    : dnaNum > 7836
    ? 3
    : dnaNum > 5224
    ? 2
    : 1;
}

export function getLevel(exp: number) {
  validate(exp, 'number');

  for (let i = 0; i < levelsTable.length; i++) {
    if (exp < levelsTable[i]) {
      return i + 1;
    }
  }
  return levelsTable.length + 1;
}

export function getClazz(dna: any, rare: number, zoanType: string) {
  validate([dna, rare, zoanType], ['string', 'number', 'string']);

  if (zoanType === SUPER_ZOAN) {
    return classTable
      .filter((it) => it.zoanType === SUPER_ZOAN)
      .find((it) => it.rare === rare).name;
  }

  const t = dna.toString() % 10 < 5 ? 1 : 2;
  const r = rare;
  const n = classTable
    .filter((it) => it.zoanType === NORMAL_ZOAN)
    .map((it) => it.name);
  return n[2 * (r - 1) + t - 1];
}

export function getImageUrl(clazz: string, level: number) {
  validate([clazz, level], ['string', 'number']);

  return classTable
    .find((it) => it.name === clazz)
    .images.find((it) => it.level.includes(level))?.url;
}

export function getTribe(e) {
  return tribesTable[e];
}

export const fightsPerDay = 3;
export const gasPerFight = 0.0009;
export const expPerWin = 9;
export const claimableInstructions =
  'Check this to multiply ZOON rewards by 0.3 and YAG rewards by 0.4';
export const claimablePercentYag = 0.4;
export const claimablePercentZoon = 0.3;
export const winRates = [0.75, 0.65, 0.54, 0.11];
export const winRate = winRates[2];
export const levelsTable = [100, 350, 1000, 2000, 4000];
export const tribesTable = ['Skyler', 'Hydrein', 'Plasmer', 'Stonic'];
export const classTable = [
  {
    name: 'Slime',
    rare: 1,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/slime_1.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/slime_2.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/slime_3.gif',
      },
    ],
  },
  {
    name: 'Slander',
    rare: 1,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Slamader_2.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Slamader_4.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Slamader_4_S.gif',
      },
    ],
  },
  {
    name: 'Mushroom',
    rare: 2,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Mushroom_1.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Mushroom_2.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Mushroom_3.gif',
      },
    ],
  },
  {
    name: 'Rabbit',
    rare: 2,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Rabbit_1.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Rabbit_3.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Rabbit_4.gif',
      },
    ],
  },
  {
    name: 'Floating',
    rare: 3,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/FLOATING_1.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/FLOATING_2.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/FLOATING_3.gif',
      },
    ],
  },
  {
    name: 'Shadow',
    rare: 3,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Shadow_1.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Shadow_4.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Shadow_5.gif',
      },
    ],
  },
  {
    name: 'Dragon',
    rare: 4,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/DR_Pink.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/DR_Green.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/DR_Black.gif',
      },
    ],
  },
  {
    name: 'Golem',
    rare: 4,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Golem_1.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Golem_2.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Golem_3.gif',
      },
    ],
  },
  {
    name: 'Rock',
    rare: 5,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Rock_1.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Rock_2.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Rock_3.gif',
      },
    ],
  },
  {
    name: 'Turtle',
    rare: 5,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/turtle_3.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/turtle_1.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/turtle_2.gif',
      },
    ],
  },
  {
    name: 'Ox',
    rare: 6,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Ox_1.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Ox_2.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Ox_3.gif',
      },
    ],
  },
  {
    name: 'Keeper',
    rare: 6,
    zoanType: NORMAL_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Keeper_3.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Keeper_2.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/Keeper_1.gif',
      },
    ],
  },
  {
    name: 'OniFlame',
    zoanType: SUPER_ZOAN,
    rare: 3,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/onion1_idle.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/onion2_idle.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/onion3_idle.gif',
      },
    ],
  },
  {
    name: 'Bombeus',
    rare: 4,
    zoanType: SUPER_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/turtle1_idle.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/turtle2_idle.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/turtle3_idle.gif',
      },
    ],
  },
  {
    name: 'Koldala',
    rare: 5,
    zoanType: SUPER_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/koala1_idle.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/koala2_idle.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/koala3_idle.gif',
      },
    ],
  },
  {
    name: 'Frogire',
    rare: 6,
    zoanType: SUPER_ZOAN,
    images: [
      {
        level: [1, 2],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/frog1_idle.gif',
      },
      {
        level: [3, 4],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/frog2_idle.gif',
      },
      {
        level: [5, 6],
        url: 'https://raw.githubusercontent.com/cryptozoon/images/master/v2/frog3_idle.gif',
      },
    ],
  },
];
