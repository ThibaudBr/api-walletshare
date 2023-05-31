import { Module } from '@nestjs/common';
import { StripeService } from './application/stripe.service';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CreateStripeCustomerCommandHandler } from './application/cqrs/handler/command/create-stripe-customer.command-handler';
import { CreateStripeCustomerEventHandler } from './application/cqrs/handler/event/create-stripe-customer.event-handler';
import { IsUserIdOwnerOfStripCustomerIdQueryQueryHandler } from './application/cqrs/handler/query/is-user-id-owner-of-strip-customer-id-query.query-handler';
import { StripeController } from './web/stripe.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CqrsModule,
    ApiLogModule,
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
  controllers: [StripeController],
  providers: [
    StripeService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command Handlers
    CreateStripeCustomerCommandHandler,
    // Event Handlers
    CreateStripeCustomerEventHandler,
    // Query Handlers
    IsUserIdOwnerOfStripCustomerIdQueryQueryHandler,
  ],
})
export class PaymentModule {}
