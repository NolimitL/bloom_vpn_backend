import { ForbiddenException } from '@nestjs/common'

export class ForbiddenToPerformException extends ForbiddenException {
  constructor() {
    super('This action is forbidden. Obtain rights to perform the action.')
  }
}
