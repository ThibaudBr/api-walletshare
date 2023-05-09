import { Module } from '@nestjs/common';
import { CompanyController } from './web/company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { CompanyEntity } from './domain/entities/company.entity';
import { CompanyEmployeeEntity } from './domain/entities/company-employee.entity';
import { AddressEntity } from '../address/domain/entities/address.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OccupationEntity } from '../occupation/domain/entities/occupation.entity';
import { CompanyService } from './application/company.service';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { AddCompanyEmployeeCommandHandler } from './application/cqrs/handler/command/add-company-employee.command-handler';
import { GiveRightToEmployeeCommandHandler } from './application/cqrs/handler/command/give-right-to-employee.command-handler';
import { RemoveCompanyCommandHandler } from './application/cqrs/handler/command/remove-company.command-handler';
import { TransferOwnershipOfCompanyCommandHandler } from './application/cqrs/handler/command/transfer-ownership-of-company.command-handler';
import { UpdateCompanyCommandHandler } from './application/cqrs/handler/command/update-company.command-handler';
import { CreateCompanyCommandHandler } from './application/cqrs/handler/command/create-company.command-handler';
import { RemoveCompanyEmployeeCommandHandler } from './application/cqrs/handler/command/remove-company-employee.command-handler';
import { RestoreCompanyCommandHandler } from './application/cqrs/handler/command/restore-company.command-handler';
import { SoftRemoveCompanyCommandHandler } from './application/cqrs/handler/command/soft-remove-company.command-handler';
import { GetAllCompanyQueryHandler } from './application/cqrs/handler/query/get-all-company.query-handler';
import { GetCompanyByIdQueryHandler } from './application/cqrs/handler/query/get-company-by-id.query-handler';
import { GetCompanyDiscoveryQueryHandler } from './application/cqrs/handler/query/get-company-discovery.query-handler';
import { GetCompanyWithCriteriaQueryHandler } from './application/cqrs/handler/query/get-company-with-criteria.query-handler';
import { GetCompanyWithProfileIdQueryHandler } from './application/cqrs/handler/query/get-company-with-profile-id.query-handler';
import { GetCompanyWithUserIdQueryHandler } from './application/cqrs/handler/query/get-company-with-user-id.query-handler';
import { GetEmployeeByCompanyIdQueryHandler } from './application/cqrs/handler/query/get-employee-by-company-id.query-handler';
import { IsRoleInCompanyQueryHandler } from './application/cqrs/handler/query/is-role-in-company.query-handler';
import { TransferOwnershipOfCompanyEventHandler } from './application/cqrs/handler/event/transfer-ownership-of-company.event-handler';
import { GiveRightToEmployeeEventHandler } from './application/cqrs/handler/event/give-right-to-employee.event-handler';
import { CreateCompanyEventHandler } from './application/cqrs/handler/event/create-company.event-handler';
import { RemoveCompanyEmployeeEventHandler } from './application/cqrs/handler/event/remove-company-employee.event-handler';
import { UpdateCompanyEventHandler } from './application/cqrs/handler/event/update-company.event-handler';
import { AddCompanyEmployeeEventHandler } from './application/cqrs/handler/event/add-company-employee.event-handler';
import { RemoveCompanyEventHandler } from './application/cqrs/handler/event/remove-company.event-handler';
import { RestoreCompanyEventHandler } from './application/cqrs/handler/event/restore-company.event-handler';
import { SoftRemoveCompanyEventHandler } from './application/cqrs/handler/event/soft-remove-company.event-handler';
import { ProfileEntity } from '../profile/domain/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CompanyEntity,
      CompanyEmployeeEntity,
      AddressEntity,
      OccupationEntity,
      ProfileEntity,
    ]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([
      { name: 'API_LOG', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_LOG) || 3101 } },
    ]),
  ],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    AddCompanyEmployeeCommandHandler,
    CreateCompanyCommandHandler,
    GiveRightToEmployeeCommandHandler,
    RemoveCompanyCommandHandler,
    RemoveCompanyEmployeeCommandHandler,
    RestoreCompanyCommandHandler,
    SoftRemoveCompanyCommandHandler,
    UpdateCompanyCommandHandler,
    TransferOwnershipOfCompanyCommandHandler,
    // Query handlers
    GetAllCompanyQueryHandler,
    GetCompanyByIdQueryHandler,
    GetCompanyDiscoveryQueryHandler,
    GetCompanyWithCriteriaQueryHandler,
    GetCompanyWithProfileIdQueryHandler,
    GetCompanyWithUserIdQueryHandler,
    GetEmployeeByCompanyIdQueryHandler,
    IsRoleInCompanyQueryHandler,
    // Events handlers
    AddCompanyEmployeeEventHandler,
    CreateCompanyEventHandler,
    GiveRightToEmployeeEventHandler,
    RemoveCompanyEmployeeEventHandler,
    RemoveCompanyEventHandler,
    RestoreCompanyEventHandler,
    SoftRemoveCompanyEventHandler,
    TransferOwnershipOfCompanyEventHandler,
    UpdateCompanyEventHandler,
  ],
})
export class CompanyModule {}
