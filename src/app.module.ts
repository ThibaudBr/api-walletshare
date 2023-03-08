import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfiguration } from './util/config/database.configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import HealthCheckModule from './api/health-check/health-check.module';
import { EntitiesToMoveModule } from './api/entities-to-create/entities-to-move.module';
import { UserModule } from './api/user/user.module';
import { ApiLogModule } from './api-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfiguration,
    }),
    // ________ Module ________
    HealthCheckModule,
    UserModule,
    ApiLogModule,
    EntitiesToMoveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
