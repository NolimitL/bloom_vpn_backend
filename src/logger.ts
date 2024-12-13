import { Logger, LoggerService } from '@nestjs/common'

import { Request } from 'express'
import * as LogDnaWinston from 'logdna-winston'
import { TransformableInfo } from 'logform'
import * as morgan from 'morgan'
import { WinstonModule } from 'nest-winston'
import { format, transports } from 'winston'
import TransportStream from 'winston-transport'

const logTemplate =
  ':real-ip | :user-id | [:date[iso]] > :method :url :status - :response-time[0] ms'

export interface ICreateLoggerOptions {
  readonly useColors: boolean
  readonly logdna: ILogDnaCredentials
}

export interface ILogDnaCredentials {
  readonly key: string
  readonly env: string
}

export function createLogger(options: ICreateLoggerOptions): LoggerService {
  const { useColors, logdna } = options
  const loggingTransports: TransportStream[] = [new transports.Console()]

  if (Object.values(logdna).every(Boolean)) {
    loggingTransports.push(
      new LogDnaWinston({
        app: 'backend',
        env: logdna.env,
        key: logdna.key,
      })
    )
  }

  return WinstonModule.createLogger({
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    },
    level: 'debug',
    format: format.combine(
      ignoreBannedContexts(),
      format.errors({ stack: true }),
      format.printf(({ level, message, context, stack }) => {
        let output: string
        if (stack) {
          output = `${level}: [${context}] ${stack}`
        } else {
          output = `${level}: [${context}] ${message}`
        }

        if (useColors) {
          return format.colorize().colorize(level, output)
        }

        return output
      })
    ),
    transports: loggingTransports,
  })
}

export function createRequestLogMiddleware(
  logger: Logger
): ReturnType<typeof morgan> {
  morgan.token('user-id', (req) => {
    // @ts-ignore
    return req.user?.userId
  })

  morgan.token('real-ip', (req: Request) => {
    // Check if we are under a reverse proxy
    const remoteIp = (req.headers['x-real-ip'] as string) ?? ''
    if (remoteIp) {
      return remoteIp.padEnd(15)
    }

    return req.ip
  })

  return morgan(logTemplate, {
    stream: {
      write(message) {
        // Use list if you want to add more exceptions
        if (message.includes('/api/stats') || message.includes('/api/ping')) {
          return
        }

        logger.debug(message.trim())
      },
    },
  })
}

const ignoreBannedContexts = format((info: TransformableInfo) => {
  const {message} = info

  if (bannedContexts.includes(message as string)) {
    return false
  }

  return info
})

/**
 * A list of banned logging contexts.
 *
 * Add a new entry to this list to ignore it.
 */
const bannedContexts: string[] = [
  'InstanceLoader',
  'RouterExplorer',
  'RoutesResolver',
]
