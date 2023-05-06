import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCompanyCommand } from '../../command/update-company.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { OccupationEntity } from '../../../../../occupation/domain/entities/occupation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import CompanyEntity from '../../../../domain/entities/company.entity';
import { Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { UpdateCompanyEvent } from '../../event/update-company.event';

@CommandHandler(UpdateCompanyCommand)
export class UpdateCompanyCommandHandler implements ICommandHandler<UpdateCompanyCommand> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateCompanyCommand): Promise<void> {
    const companyToUpdate: CompanyEntity = await this.companyRepository
      .findOneOrFail({
        relations: ['ownerProfile', 'occupations'],
        where: {
          id: command.companyId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'UpdateCompanyCommandHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });

    const companyUpdated: CompanyEntity = new CompanyEntity({
      ...companyToUpdate,
      ...command?.updateCompanyDto,
    });

    if (command.newProfileOwnerId) {
      companyToUpdate.ownerProfile = await this.profileRepository
        .findOneOrFail({
          where: {
            id: command.newProfileOwnerId,
          },
        })
        .catch(async error => {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              error: error.message,
              handler: 'UpdateCompanyCommandHandler',
              localisation: 'profileRepository.findOneOrFail',
            }),
          );
          throw new Error('Profile not found');
        });
    }

    if (command.updateOccupationIdList) {
      companyToUpdate.occupations = [];
      for (const occupationId in command.updateOccupationIdList) {
        companyToUpdate.occupations.push(
          await this.occupationRepository
            .findOneOrFail({
              where: {
                id: occupationId,
              },
            })
            .catch(async error => {
              await this.eventBus.publish(
                new ErrorCustomEvent({
                  error: error.message,
                  handler: 'UpdateCompanyCommandHandler',
                  localisation: 'occupationRepository.findOneOrFail',
                }),
              );
              throw new Error('Occupation not found');
            }),
        );
      }
    }

    const errors: ValidationError[] = await validate(companyUpdated);
    if (errors.length > 0) {
      throw errors;
    }

    await this.companyRepository
      .save(companyUpdated)
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'UpdateCompanyCommandHandler',
            localisation: 'companyRepository.save',
          }),
        );
      })
      .then(async () => {
        await this.eventBus.publish(
          new UpdateCompanyEvent({
            companyId: command.companyId,
          }),
        );
      });
  }
}
