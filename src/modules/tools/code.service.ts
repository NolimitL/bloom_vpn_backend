import { Injectable } from '@nestjs/common'
import { customAlphabet } from 'nanoid'

@Injectable()
export class CodeService {
  private readonly alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  constructor() {}

  /**
   * Generate code with a certain length.
   * Default length is 8.
   * @param length
   */
  public generateCode(length?: number): string {
    const generator = customAlphabet(this.alphabet, 8)
    return generator(length)
  }
}
