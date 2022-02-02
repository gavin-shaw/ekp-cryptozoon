import { validate } from 'bycontract';
import { ethers } from 'ethers';

// TODO: is there a more idiomatic way in node js to do this padding?
export function padNumber(value: number | string, length: number) {
  validate([value, length], ['number|string', 'number']);

  return ethers.BigNumber.from(value)
    .toHexString()
    .replace('0x', '')
    .padStart(length, '0');
}
