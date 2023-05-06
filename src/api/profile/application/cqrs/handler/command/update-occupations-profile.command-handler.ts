import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOccupationsProfileCommand } from '../../command/update-occupations-profile.command';
import { UpdateOccupationsProfileEvent } from '../../event/update-occupations-profile.event';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { OccupationEntity } from '../../../../../occupation/domain/entities/occupation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(UpdateOccupationsProfileCommand)
export class UpdateOccupationsProfileCommandHandler implements ICommandHandler<UpdateOccupationsProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateOccupationsProfileCommand): Promise<void> {
    const profile = await this.profileRepository
      .findOneOrFail({
        relations: ['occupations'],
        where: [{ id: command.id }],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'profileRepository.findOneOrFail',
            handler: 'UpdateOccupationsProfileCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Profile not found');
      });

    if (command.occupations.length == 0) {
      profile.occupations = [];
      await this.profileRepository.save(profile).catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'UpdateOccupationsProfileCommandHandler',
            error: error.message,
            localisation: 'profileRepository.save',
          }),
        );
        throw new Error('Error saving profile');
      });
    } else {
      const occupationPromises: Promise<OccupationEntity>[] = command.occupations.map(async occupationId => {
        return await this.occupationRepository
          .findOneOrFail({
            where: [{ id: occupationId }],
          })
          .catch(async error => {
            await this.eventBus.publish(
              new ErrorCustomEvent({
                handler: 'UpdateOccupationsProfileCommandHandler',
                error: error.message,
                localisation: 'occupationRepository.findOneOrFail',
              }),
            );
            throw new Error('Occupation not found');
          });
      });
      const occupations: OccupationEntity[] = await Promise.all(occupationPromises);

      if (occupations.length == 0) {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'UpdateOccupationsProfileCommandHandler',
            error: 'Occupations not found',
            localisation: 'occupationRepository.findOneOrFail',
          }),
        );
        throw new Error('Occupations not found');
      } else {
        profile.occupations = occupations;
        await this.profileRepository.save(profile).catch(async error => {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'UpdateOccupationsProfileCommandHandler',
              error: error.message,
              localisation: 'profileRepository.save',
            }),
          );
          throw new Error('Error saving profile');
        });
      }
    }

    await this.eventBus.publish(
      new UpdateOccupationsProfileEvent({
        listOfOccupationId: command.occupations,
        profileId: command.id,
      }),
    );
  }
}
