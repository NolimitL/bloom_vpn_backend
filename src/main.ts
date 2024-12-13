import {
  Logger,
  ValidationPipe,
  NotFoundException,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'

import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import { json, Request, Response, urlencoded } from 'express'

import { AppModule } from './app.module'
import { createLogger, createRequestLogMiddleware } from './logger'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { EntityNotFoundError } from 'typeorm'
import { ErrorTransformInterceptor } from './common/interceptors/error-transform.interceptor'
import { createMonitoringMiddleware } from './monitoring'

const origins = [
  /^https?:\/\/localhost:\d+$/,
  /^https:\/\/.+?\.thebloom\.tech$/,
  /^https:\/\/.+?\.hub.thebloom\.tech$/,
]

function applyRawBody(
  req: Request,
  res: Response,
  buffer: Buffer,
  encoding: BufferEncoding
) {
  const headersWithSignature = [
    'stripe-signature',
    'x-slack-signature',
    'webhook-id',
  ]

  for (const header of headersWithSignature) {
    if (req.header(header)) {
      if (buffer && buffer.length) {
        // @ts-ignore
        req.rawBody = buffer.toString(encoding || 'utf8')
      }
      return
    }
  }
}

async function bootstrap() {
  dotenv.config()
  const PORT = process.env.PORT || 3000

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: createLogger({
      useColors: Boolean(process.env.LOGDNA_USE_COLORS),
      logdna: {
        key: process.env.LOGDNA_KEY,
        env: process.env.LOGDNA_ENV,
      },
    }),
  })

  /**
   * CORS
   */
  app.enableCors({
    credentials: true,
    origin: origins,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Time'],
  })

  /**
   * PIPES
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )

  /**
   * INTERCEPTORS
   */
  app.useGlobalInterceptors(
    new ErrorTransformInterceptor(EntityNotFoundError, NotFoundException),
    new ClassSerializerInterceptor(app.get(Reflector))
  )

  /**
   * GUARDS
   */
  // app.useGlobalGuards(new HeadersGuard())

  /**
   * OTHER MIDDLEWARES
   */
  app.useGlobalFilters(new HttpExceptionFilter())
  // app.useWebSocketAdapter(new WebSocketAdapter(app))
  app.setGlobalPrefix('api')
  app.use(createRequestLogMiddleware(new Logger('Request')))
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ verify: applyRawBody, extended: true }))
  app.use(bodyParser.json({ verify: applyRawBody }))
  app.use(createMonitoringMiddleware())
  app.use(json({ limit: '255mb' }))
  app.use(urlencoded({ extended: true, limit: '255mb' }))

  await app.listen(PORT, () => {
    Logger.log(`Server is running on port ${PORT}`, 'Main')
  })
}

bootstrap()
