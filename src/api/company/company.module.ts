import { Module } from '@nestjs/common';
import { CompanyController } from './web/company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { CompanyEntity } from './domain/entities/company.entity';
import { CompanyEmployeeEntity } from './domain/entities/company-employee.entity';
import { AddressEntity } from '../address/domain/entities/address.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
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
import { HttpModule } from '@nestjs/axios';
import { CardPresetEntity } from './domain/entities/card-preset.entity';
import { CreateCardPresetCommandHandler } from './application/cqrs/handler/command/create-card-preset.command-handler';
import { RemoveCardPresetCommandHandler } from './application/cqrs/handler/command/remove-card-preset.command-handler';
import { RestoreCardPresetCommandHandler } from './application/cqrs/handler/command/restore-card-preset.command-handler';
import { SoftRemoveCardPresetCommandHandler } from './application/cqrs/handler/command/soft-remove-card-preset.command-handler';
import { UpdateCardPresetCommandHandler } from './application/cqrs/handler/command/update-card-preset.command-handler';
import { CreateCardPresetEventHandler } from './application/cqrs/handler/event/create-card-preset.event-handler';
import { RemoveCardPresetEventHandler } from './application/cqrs/handler/event/remove-card-preset.event-handler';
import { RestoreCardPresetEventHandler } from './application/cqrs/handler/event/restore-card-preset.event-handler';
import { SoftRemoveCardPresetEventHandler } from './application/cqrs/handler/event/soft-remove-card-preset.event-handler';
import { UpdateCardPresetEventHandler } from './application/cqrs/handler/event/update-card-preset.event-handler';
import { GetAllCardPresetByCompanyIdQueryHandler } from './application/cqrs/handler/query/get-all-card-preset-by-company-id.query-handler';
import { GetCardPresetByIdQueryHandler } from './application/cqrs/handler/query/get-card-preset-by-id.query-handler';
import { UpdateUserRoleCommandHandler } from '../user/application/cqrs/handler/command/update-user-role.command-handler';
import { UpdateUserRoleEventHandler } from '../user/application/cqrs/handler/event/update-user-role.event-handler';
import { SubscriptionEntity } from '../payment/subscription/domain/entities/subscription.entity';
import { GetUserByIdQueryHandler } from './application/cqrs/handler/query/get-user-by-id.query-handler';
import { ApiMailModule } from '../api-mail/api-mail.module';
import { ApiMailService } from '../api-mail/application/api-mail.service';
import { GetCompanyByOwnerUserIdQueryHandler } from './application/cqrs/handler/query/get-company-by-owner-user-id.query-handler';
import { GetCardPresetByCompanyIdQueryHandler } from './application/cqrs/handler/query/get-card-preset-by-company-id.query-handler';
import { GetCompanyEmployeeByOwnerUserIdQueryHandler } from './application/cqrs/handler/query/get-company-employee-by-owner-user-id.query-handler';
import { GetCompanyPresetByOwnerUserIdQueryHandler } from './application/cqrs/handler/query/get-company-preset-by-owner-user-id.query-handler';
import { GetCompanyEmployeeByOwnerUserIdForChartQueryHandler } from './application/cqrs/handler/query/get-company-employee-by-owner-user-id-for-chart.query-handler';

@Module({
  controllers: [CompanyController],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CompanyEntity,
      CompanyEmployeeEntity,
      AddressEntity,
      OccupationEntity,
      ProfileEntity,
      CardPresetEntity,
      SubscriptionEntity,
    ]),
    CqrsModule,
    ApiLogModule,
    HttpModule,
    ApiMailModule,
  ],
  providers: [
    ApiMailService,
    CompanyService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    AddCompanyEmployeeCommandHandler,
    CreateCardPresetCommandHandler,
    CreateCompanyCommandHandler,
    GiveRightToEmployeeCommandHandler,
    RemoveCardPresetCommandHandler,
    RemoveCompanyCommandHandler,
    RemoveCompanyEmployeeCommandHandler,
    RestoreCardPresetCommandHandler,
    RestoreCompanyCommandHandler,
    SoftRemoveCardPresetCommandHandler,
    SoftRemoveCompanyCommandHandler,
    UpdateCardPresetCommandHandler,
    UpdateCompanyCommandHandler,
    TransferOwnershipOfCompanyCommandHandler,
    // Events handlers
    AddCompanyEmployeeEventHandler,
    CreateCardPresetEventHandler,
    CreateCompanyEventHandler,
    GiveRightToEmployeeEventHandler,
    RemoveCardPresetEventHandler,
    RemoveCompanyEmployeeEventHandler,
    RemoveCompanyEventHandler,
    RestoreCardPresetEventHandler,
    RestoreCompanyEventHandler,
    SoftRemoveCardPresetEventHandler,
    SoftRemoveCompanyEventHandler,
    UpdateCardPresetEventHandler,
    UpdateCompanyEventHandler,
    TransferOwnershipOfCompanyEventHandler,
    // Query handlers
    GetAllCardPresetByCompanyIdQueryHandler,
    GetAllCompanyQueryHandler,
    GetCardPresetByIdQueryHandler,
    GetCompanyByIdQueryHandler,
    GetCompanyDiscoveryQueryHandler,
    GetCompanyWithCriteriaQueryHandler,
    GetCompanyWithProfileIdQueryHandler,
    GetCompanyWithUserIdQueryHandler,
    GetEmployeeByCompanyIdQueryHandler,
    GetUserByIdQueryHandler,
    IsRoleInCompanyQueryHandler,
    GetCompanyByOwnerUserIdQueryHandler,
    GetCardPresetByCompanyIdQueryHandler,
    GetCompanyEmployeeByOwnerUserIdQueryHandler,
    GetCompanyPresetByOwnerUserIdQueryHandler,
    GetCompanyEmployeeByOwnerUserIdForChartQueryHandler,
    // Import handlers
    UpdateUserRoleCommandHandler,
    UpdateUserRoleEventHandler,
  ],
})
export class CompanyModule {}
