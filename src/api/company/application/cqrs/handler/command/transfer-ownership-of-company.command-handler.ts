import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TransferOwnershipOfCompanyEvent } from '../../event/transfer-ownership-of-company.event';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../../../domain/entities/company.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';

@CommandHandler(TransferOwnershipOfCompanyEvent)
export class TransferOwnershipOfCompanyCommandHandler implements ICommandHandler<TransferOwnershipOfCompanyEvent> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(event: TransferOwnershipOfCompanyEvent): Promise<void> {
    const company: CompanyEntity = await this.companyRepository
      .findOneOrFail({
        where: {
          id: event.companyId,
        },
        relations: ['ownerProfile'],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'TransferOwnershipOfCompanyCommandHandler',
            localisation: 'companyRepository.findOneOrFail',
          }),
        );
        throw new Error('Company not found');
      });

    const profile: ProfileEntity = await this.profileRepository
      .findOneOrFail({
        where: {
          id: event.profileId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'TransferOwnershipOfCompanyCommandHandler',
            localisation: 'profileRepository.findOneOrFail',
          }),
        );
        throw new Error('Profile not found');
      });

    if (company.ownerProfile.id == profile.id) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: 'Profile is already the owner of this company',
          handler: 'TransferOwnershipOfCompanyCommandHandler',
          localisation: 'company.ownerProfile.id == profile.id',
        }),
      );
      throw new Error('You are already the owner of this company');
    }

    company.ownerProfile = profile;
    await this.companyRepository
      .save(company)
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'TransferOwnershipOfCompanyCommandHandler',
            localisation: 'companyRepository.save',
          }),
        );
        throw new Error('Error while saving company');
      })
      .then(async () => {
        await this.eventBus.publish(
          new TransferOwnershipOfCompanyEvent({
            companyId: company.id,
            profileId: profile.id,
          }),
        );
      });
  }
}
