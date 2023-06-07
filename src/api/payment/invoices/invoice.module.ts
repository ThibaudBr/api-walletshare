import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../user/domain/entities/user.entity";
import {CqrsModule} from "@nestjs/cqrs";
import {ApiLogModule} from "../../api-log/api-log.module";
import {HttpModule} from "@nestjs/axios";
import {ApiLogService} from "../../api-log/application/api-log.service";
import {CreateLogCommandHandler} from "../../api-log/application/cqrs/handler/command/create-log.command-handler";
import {StripeService} from "../stripe/application/stripe.service";
import {InvoiceService} from "./application/invoice.service";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    CqrsModule,
    ApiLogModule,
    HttpModule,
  ],
  controllers: [
    InvoiceController,
  ],
  providers: [
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Stripe module
    StripeService,
    // Invoice module
    InvoiceService,
    // Command
    // Event
    // Query
})
export class InvoiceModule {}
