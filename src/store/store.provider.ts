import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import * as path from 'path'

export const storageProviders = [
  TypeOrmModule.forRootAsync({
    imports: [],
    useFactory: async (): Promise<TypeOrmModuleOptions> => {
      return {
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number.parseInt(process.env.DATABASE_PORT),
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        migrationsRun: true,
        migrations: [__dirname + '/_migrations/*{.ts,.js}'],
        entities: [`${path.join(__dirname, '..')}/**/*.entity.{ts,js}`],
        logging: false,
        subscribers: [`${path.join(__dirname, '..')}/**/*.subscriber.{ts,js}`],
        // ? in production set always true
        // synchronize: true
      }
    },
    inject: [],
  }),
]
