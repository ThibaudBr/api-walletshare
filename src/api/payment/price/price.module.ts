import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/domain/entities/user.entity';
import { ProductEntity } from '../product/domain/entities/product.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../../api-log/api-log.module';
import { StripeModule } from '../stripe/stripe.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PriceEntity } from './domain/entities/price.entity';
import { PriceController } from './web/price.controller';
import { ApiLogService } from '../../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../../api-log/application/cqrs/handler/command/create-log.command-handler';
import { StripeService } from '../stripe/application/stripe.service';
import { PriceService } from './application/price.service';
import { CreatePriceCommandHandler } from './application/cqrs/handler/command/create-price.command-handler';
import { RemovePriceCommandHandler } from './application/cqrs/handler/command/remove-price.command-handler';
import { RestorePriceCommandHandler } from './application/cqrs/handler/command/restore-price.command-handler';
import { SoftRemovePriceCommandHandler } from './application/cqrs/handler/command/soft-remove-price.command-handler';
import { UpdatePriceCommandHandler } from './application/cqrs/handler/command/update-price.command-handler';
import { CreatePriceEventHandler } from './application/cqrs/handler/event/create-price.event-handler';
import { RestorePriceEventHandler } from './application/cqrs/handler/event/restore-price.event-handler';
import { RemovePriceEventHandler } from './application/cqrs/handler/event/remove-price.event-handler';
import { SoftRemovePriceEventHandler } from './application/cqrs/handler/event/soft-remove-price.event-handler';
import { UpdatePriceStripeEventHandler } from './application/cqrs/handler/event/update-price.event-handler';
import { GetAllPriceQueryHandler } from './application/cqrs/handler/query/get-all-price.query-handler';
import { GetAllPriceByProductIdQueryHandler } from './application/cqrs/handler/query/get-all-price-by-product-id.query-handler';
import { GetPriceByIdQueryHandler } from './application/cqrs/handler/query/get-price-by-id.query-handler';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, ProductEntity, PriceEntity]),
    CqrsModule,
    ApiLogModule,
    StripeModule,
    ClientsModule.register([
      {
        name: 'API_LOG',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST_API_LOG || 'localhost',
          port: Number(process.env.PORT_API_LOG) || 3101,
        },
      },
    ]),
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, ProductEntity]),
    CqrsModule,
    ApiLogModule,
    StripeModule,
    ClientsModule.register([
      {
        name: 'API_LOG',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST_API_LOG || 'localhost',
          port: Number(process.env.PORT_API_LOG) || 3101,
        },
      },
    ]),
  ],
  controllers: [PriceController],
  providers: [
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Stripe module
    StripeService,
    // Price module
    PriceService,
    // Command handlers
    CreatePriceCommandHandler,
    RemovePriceCommandHandler,
    RestorePriceCommandHandler,
    SoftRemovePriceCommandHandler,
    UpdatePriceCommandHandler,
    // Event handlers
    CreatePriceEventHandler,
    RemovePriceEventHandler,
    RestorePriceEventHandler,
    SoftRemovePriceEventHandler,
    UpdatePriceStripeEventHandler,
    // Query handlers
    GetAllPriceQueryHandler,
    GetAllPriceByProductIdQueryHandler,
    GetPriceByIdQueryHandler,
  ],
})
export class PriceModule {}
