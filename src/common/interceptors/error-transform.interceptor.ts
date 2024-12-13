import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

import { catchError } from 'rxjs/operators'
import { Observable } from 'rxjs';

export class ErrorTransformInterceptor implements NestInterceptor {
  constructor(
    private readonly fromErrorCtor: Constructor<Error>,
    private readonly toErrorCtor: Constructor<Error>
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof this.fromErrorCtor) {
          throw new this.toErrorCtor(error.message)
        }

        throw error
      })
    )
  }

}
