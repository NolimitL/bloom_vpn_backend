import { ExecutionContext, Injectable } from '@nestjs/common'
import { ThrottlerGuard as BaseThrottlerGuard } from '@nestjs/throttler'

import * as md5 from 'md5'

export const THROTTLER_PARAMS = 'ThrottleParams'

@Injectable()
export class ThrottlerGuard extends BaseThrottlerGuard {
  protected getTracker(req: Record<string, unknown>): string {
    // Get IP address from headers if we are under the reverse proxy
    const remoteIp = (req.headers['x-real-ip'] as string) ?? ''

    return remoteIp || (req.ip as string)
  }

  protected generateKey(context: ExecutionContext, suffix: string): string {
    const reqContext = this.getRequestContext(context)
    const keys = [
      context.getClass().name,
      context.getHandler().name,
      reqContext,
      suffix,
    ].filter(Boolean)

    return md5(keys.join('-'))
  }

  private getRequestContext(context: ExecutionContext): string {
    const handler = context.getHandler()
    const classRef = context.getClass()

    const request = context.switchToHttp().getRequest()

    const paramNames = this.reflector.getAllAndOverride(THROTTLER_PARAMS, [
      handler,
      classRef,
    ])
    if (!paramNames) {
      return null
    }

    const contextKeys = []

    for (const paramName of paramNames) {
      const paramValue = request.params[paramName]
      if (!paramValue) {
        throw new Error()
      }

      contextKeys.push(paramValue)
    }

    return contextKeys.join(':')
  }
}
