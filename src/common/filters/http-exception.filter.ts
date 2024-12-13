import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'

import { Response } from 'express'

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsHandler')

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let statusCode: number
    let message: string | ReadonlyArray<string>
    let error: string = undefined

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()

      const response = exception.getResponse()
      if (HttpExceptionFilter.isResponseObject(response)) {
        message = response.message
        error = response.error
      } else {
        message = exception.message
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR
      message = exception.message
    }

    if (!(exception instanceof HttpException) && exception instanceof Error) {
      this.logger.error(exception.message, exception.stack)
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    })
  }

  private static isResponseObject(
    response: any
  ): response is HttpExceptionResponse {
    return (
      typeof response.statusCode === 'number' &&
      (typeof response.message === 'string' || Array.isArray(response.message))
    )
  }
}

interface HttpExceptionResponse {
  readonly statusCode: number
  readonly message: string | ReadonlyArray<string>
  readonly error?: string
}
