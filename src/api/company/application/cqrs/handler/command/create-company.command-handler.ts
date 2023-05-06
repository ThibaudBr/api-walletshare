import { CommandHandler, EventBus, IEventHandler } from '@nestjs/cqrs';
import { CreateCompanyCommand } from '../../command/create-company.command';
import CompanyEntity from '../../../../domain/entities/company.entity';
import { validate } from 'class-validator';
import { CreateCompanyEvent } from '../../event/create-company.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { CompanyEmployeeEntity } from '../../../../domain/entities/company-employee.entity';
import { AddCompanyEmployeeEvent } from '../../event/add-company-employee.event';
import { RoleCompanyEmployeeEnum } from '../../../../domain/enum/role-company-employee.enum';
import { OccupationEntity } from '../../../../../occupation/domain/entities/occupation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(CreateCompanyCommand)
export class CreateCompanyCommandHandler implements IEventHandler<CreateCompanyCommand> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(CompanyEmployeeEntity)
    private readonly companyEmployeeEntityRepository: Repository<CompanyEmployeeEntity>,
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async handle(command: CreateCompanyCommand): Promise<string> {
    const profile: ProfileEntity = await this.profileRepository
      .findOneOrFail({
        where: {
          id: command.profileId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'CreateCompanyCommandHandler',
            localisation: 'profileRepository.findOneOrFail',
          }),
        );
        throw new Error('Profile not found');
      });

    const newCompany = new CompanyEntity({
      ...command.createCompanyDto,
      ownerProfile: profile,
    });

    if (command.occupationIdList) {
      for (const occupationId of command.occupationIdList) {
        const occupation: OccupationEntity = await this.occupationRepository
          .findOneOrFail({
            where: {
              id: occupationId,
            },
          })
          .catch(async error => {
            await this.eventBus.publish(
              new ErrorCustomEvent({
                error: error.message,
                handler: 'CreateCompanyCommandHandler',
                localisation: 'occupationRepository.findOneOrFail',
              }),
            );
            throw new Error('Occupation not found');
          });
        newCompany.occupations.push(occupation);
      }
    }

    const errors = await validate(newCompany);
    if (errors.length > 0) {
      throw errors;
    }

    return await this.companyRepository.save(newCompany).then(async company => {
      await this.eventBus.publish(
        new CreateCompanyEvent({
          companyId: company.id,
          profileId: profile.id,
        }),
      );
      await this.companyEmployeeEntityRepository
        .save({
          company: company,
          profile: profile,
          roles: [RoleCompanyEmployeeEnum.OWNER],
        })
        .then(async companyEmployee => {
          this.eventBus.publish(
            new AddCompanyEmployeeEvent({
              companyId: companyEmployee.company.id,
              profileId: companyEmployee.profile.id,
              roles: companyEmployee.roles,
            }),
          );
        })
        .catch(async error => {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              error: error.message,
              handler: 'CreateCompanyCommandHandler',
              localisation: 'companyEmployeeEntityRepository.save',
            }),
          );
          throw new Error('Company employee not created');
        });
      return company.id;
    });
  }
}
