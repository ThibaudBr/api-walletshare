import { Module } from '@nestjs/common';
import { AddressController } from './web/address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { CompanyEntity } from '../company/domain/entities/company.entity';
import { CompanyEmployeeEntity } from '../company/domain/entities/company-employee.entity';
import { AddressEntity } from './domain/entities/address.entity';
import { AddressService } from './application/address.service';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { IsRoleInCompanyQueryHandler } from '../company/application/cqrs/handler/query/is-role-in-company.query-handler';
import { GetAddressByIdQueryHandler } from './application/cqrs/handler/query/get-address-by-id.query-handler';
import { GetAllAddressQueryHandler } from './application/cqrs/handler/query/get-all-address.query-handler';
import { IsAbleToUpdateAddressQueryHandler } from './application/cqrs/handler/query/is-able-to-update-address.query-handler';
import { CreateAddressEventHandler } from './application/cqrs/handler/event/create-address.event-handler';
import { RemoveAddressEventHandler } from './application/cqrs/handler/event/remove-address.event-handler';
import { RestoreAddressEventHandler } from './application/cqrs/handler/event/restore-address.event-handler';
import { SoftRemoveAddressEventHandler } from './application/cqrs/handler/event/soft-remove-address.event-handler';
import { UpdateAddressEventHandler } from './application/cqrs/handler/event/update-address.event-handler';
import { CreateAddressCommandHandler } from './application/cqrs/handler/command/create-address.command-handler';
import { RemoveAddressCommandHandler } from './application/cqrs/handler/command/remove-address-command.handler';
import { RestoreAddressCommandHandler } from './application/cqrs/handler/command/restore-address.command-handler';
import { SoftRemoveAddressCommandHandler } from './application/cqrs/handler/command/soft-remove-address.command-handler';
import { UpdateAddressCommandHandler } from './application/cqrs/handler/command/update-address.command-handler';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CompanyEntity, CompanyEmployeeEntity, AddressEntity]),
    CqrsModule,
    ApiLogModule,
    HttpModule,
  ],
  controllers: [AddressController],
  providers: [
    AddressService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    CreateAddressCommandHandler,
    RemoveAddressCommandHandler,
    RestoreAddressCommandHandler,
    SoftRemoveAddressCommandHandler,
    UpdateAddressCommandHandler,
    // Query handlers
    IsRoleInCompanyQueryHandler,
    GetAddressByIdQueryHandler,
    GetAllAddressQueryHandler,
    IsAbleToUpdateAddressQueryHandler,
    // Events handlers
    CreateAddressEventHandler,
    RemoveAddressEventHandler,
    RestoreAddressEventHandler,
    SoftRemoveAddressEventHandler,
    UpdateAddressEventHandler,
  ],
})
export class AddressModule {}
