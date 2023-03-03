import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { logger } from './winston-logger.config';

@Injectable()
export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    try {
      if (process.env.NODE_ENV === 'prod') {
        logger.info('NODE_ENV is prod');
        return {
          type: 'postgres',
          host: process.env.TYPEORM_HOST_PROD,
          port: process.env.TYPEORM_PORT_PROD ? parseInt(process.env.TYPEORM_PORT_PROD) : 5432,
          username: process.env.TYPEORM_USERNAME_PROD,
          password: process.env.TYPEORM_PASSWORD_PROD,
          database: process.env.TYPEORM_DATABASE_PROD,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
          entities: [join(__dirname, '**/*.entity{.ts,.js}')],
          synchronize: process.env.TYPEORM_SYNCHRONIZE_PROD === 'true',
          logging: process.env.TYPEORM_LOGGING_PROD === 'true',
        };
      } else if (process.env.NODE_ENV === 'pprod') {
        logger.info('NODE_ENV is pprod');
        return {
          type: 'postgres',
          host: process.env.TYPEORM_HOST_PPROD,
          port: process.env.TYPEORM_PORT_PPROD ? parseInt(process.env.TYPEORM_PORT_PPROD) : 5432,
          username: process.env.TYPEORM_USERNAME_PPROD,
          password: process.env.TYPEORM_PASSWORD_PPROD,
          database: process.env.TYPEORM_DATABASE_PPROD,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
          entities: [join(__dirname, '**/*.entity{.ts,.js}')],
          synchronize: process.env.TYPEORM_SYNCHRONIZE_PPROD === 'true',
          logging: process.env.TYPEORM_LOGGING_PPROD === 'true',
        };
      } else if (process.env.NODE_ENV === 'test') {
        logger.info('NODE_ENV is test');
        return {
          type: 'postgres',
          host: process.env.TYPEORM_HOST_TEST,
          port: process.env.TYPEORM_PORT_TEST ? parseInt(process.env.TYPEORM_PORT_TEST) : 5432,
          username: process.env.TYPEORM_USERNAME_TEST,
          password: process.env.TYPEORM_PASSWORD_TEST,
          database: process.env.TYPEORM_DATABASE_TEST,
          entities: [join(__dirname, '**/*.entity{.ts,.js}')],
          synchronize: process.env.TYPEORM_SYNCHRONIZE_TEST === 'true',
          logging: process.env.TYPEORM_LOGGING_TEST === 'true',
        };
      } else if (process.env.NODE_ENV === 'dev') {
        logger.info('NODE_ENV is dev');
        return {
          type: 'postgres',
          host: process.env.TYPEORM_HOST_DEV,
          port: process.env.TYPEORM_PORT_DEV ? parseInt(process.env.TYPEORM_PORT_DEV) : 5432,
          username: process.env.TYPEORM_USERNAME_DEV,
          password: process.env.TYPEORM_PASSWORD_DEV,
          database: process.env.TYPEORM_DATABASE_DEV,
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          logging: process.env.TYPEORM_LOGGING_DEV === 'true',
          synchronize: process.env.TYPEORM_SYNCHRONIZE_DEV === 'true',
        };
      } else {
        logger.error('NODE_ENV is not set');
        return {};
      }
    } catch (error) {
      logger.error('An error occurred while trying to connect to the database: ', error);
      throw new Error('NODE_ENV is not set');
    }
  }
}
