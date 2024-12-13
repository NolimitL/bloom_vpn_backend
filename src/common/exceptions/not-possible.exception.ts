import { BadRequestException } from '@nestjs/common'

export class NotPossibleException extends BadRequestException {
  constructor(message?: string) {
    super(`It is not possible to perform the action. ${message}`)
  }
}
