import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../../api-log/api-log.module';
import { ProductEntity } from './domain/entities/product.entity';
import { ProductController } from './web/product.controller';
import { ApiLogService } from '../../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../../api-log/application/cqrs/handler/command/create-log.command-handler';
import { StripeService } from '../stripe/application/stripe.service';
import { ProductService } from './application/product.service';
import { RestoreProductCommandHandler } from './application/cqrs/handler/command/restore-product.command-handler';
import { SoftRemoveProductCommandHandler } from './application/cqrs/handler/command/soft-remove-product.command-handler';
import { UpdateProductCommandHandler } from './application/cqrs/handler/command/update-product.command-handler';
import { GetAllProductQueryHandler } from './application/cqrs/handler/query/get-all-product.query-handler';
import { GetAllProductAdminQueryHandler } from './application/cqrs/handler/query/get-all-product-admin.query-handler';
import { GetProductByIdAdminQueryHandler } from './application/cqrs/handler/query/get-product-by-id-admin.query-handler';
import { RemoveProductEventHandler } from './application/cqrs/handler/event/remove-product.event-handler';
import { RestoreProductEventHandler } from './application/cqrs/handler/event/restore-product.event-handler';
import { SoftRemoveProductEventHandler } from './application/cqrs/handler/event/soft-remove-product.event-handler';
import { UpdateProductEventHandler } from './application/cqrs/handler/event/update-product.event-handler';
import { GetProductByIdQueryHandler } from './application/cqrs/handler/query/get-product-by-id.query-handler';
import { CreateProductEventHandler } from './application/cqrs/handler/event/create-product.event-handler';
import { CreateProductCommandHandler } from './application/cqrs/handler/command/create-product.command-handler';
import { RemoveProductCommandHandler } from './application/cqrs/handler/command/remove-product.command-handler';
import { StripeModule } from '../stripe/stripe.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, ProductEntity]),
    CqrsModule,
    ApiLogModule,
    StripeModule,
    HttpModule,
  ],
  controllers: [ProductController],
  providers: [
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Stripe module
    StripeService,
    // Product module
    ProductService,
    // Command handlers
    CreateProductCommandHandler,
    RemoveProductCommandHandler,
    RestoreProductCommandHandler,
    SoftRemoveProductCommandHandler,
    UpdateProductCommandHandler,
    // Event handlers
    CreateProductEventHandler,
    RemoveProductEventHandler,
    RestoreProductEventHandler,
    SoftRemoveProductEventHandler,
    UpdateProductEventHandler,
    // Query handlers
    GetProductByIdQueryHandler,
    GetAllProductQueryHandler,
    GetAllProductAdminQueryHandler,
    GetProductByIdAdminQueryHandler,
  ],
})
export class ProductModule {}
