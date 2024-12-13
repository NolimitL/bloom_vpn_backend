import { BadRequestException } from '@nestjs/common'

export class UserAlreadyExistsException extends BadRequestException {
  constructor() {
    super('User already exists, try to login.')
  }
}
