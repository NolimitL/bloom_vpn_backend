import { Injectable } from '@nestjs/common'
import { Options, hash, verify, argon2id } from 'argon2'

/**
 * Argon 2 hash algorithm configuration option
 */
export const HASH_DEFAULT_CONF: Options = {
  type: argon2id,
  hashLength: 64,
}

@Injectable()
export class HashService {
  constructor() {}

  public async generateHash(plain: string): Promise<string> {
    return hash(plain, {
      ...HASH_DEFAULT_CONF,
      raw: false,
    })
  }

  public async verifyHash(plain: string, hashed: string): Promise<boolean> {
    return verify(hashed, plain)
  }
}
