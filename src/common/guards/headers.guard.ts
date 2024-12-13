import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'

@Injectable()
export class HeadersGuard implements CanActivate {
  private readonly logger = new Logger(HeadersGuard.name)
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { headers } = context.switchToHttp().getRequest<Request>()
    if (!headers.origin) {
      this.logger.warn('Request Origin header is undefined.')
      throw new ForbiddenException()
    }
    return true
  }
}
