import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TokenGuard } from '../guards/token.guard'

/**
 * Decorator to retrieve UserId from Token
 */
export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const cont = ctx.switchToHttp().getRequest()
    const { user } = cont
    if (!user) {
      throw new Error(
        `Unable to get userId from request. Probably ${TokenGuard.name} decorator is not specified?`
      )
    }

    return user.userId
  }
)
