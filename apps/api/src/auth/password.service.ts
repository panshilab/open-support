import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  hash(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64, {
      N: 16384,
      r: 8,
      p: 1,
    }).toString('hex');
    return `scrypt:16384:8:1:${salt}:${hash}`;
  }

  verify(password: string, storedHash: string | null | undefined) {
    if (!storedHash) {
      return false;
    }

    const [algorithm, cost, blockSize, parallelization, salt, hash] = storedHash.split(':');
    if (algorithm !== 'scrypt' || !cost || !blockSize || !parallelization || !salt || !hash) {
      return false;
    }

    const received = scryptSync(password, salt, Buffer.from(hash, 'hex').length, {
      N: Number(cost),
      r: Number(blockSize),
      p: Number(parallelization),
    });
    const expected = Buffer.from(hash, 'hex');

    return expected.length === received.length && timingSafeEqual(expected, received);
  }
}
