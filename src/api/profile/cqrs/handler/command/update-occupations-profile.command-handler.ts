import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOccupationsProfileCommand } from '../../command/update-occupations-profile.command';
import { UpdateOccupationsProfileEvent } from '../../event/update-occupations-profile.event';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { OccupationEntity } from '../../../../occupation/domain/entities/occupation.entity';

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
    try {
      const profile = await this.profileRepository
        .findOneOrFail({
          where: [{ id: command.id }],
        })
        .catch(() => {
          throw new Error('Profile not found');
        });

      const occupationPromises: Promise<OccupationEntity>[] = command.occupations.map(async occupationId => {
        return await this.occupationRepository
          .findOneOrFail({
            where: [{ id: occupationId }],
          })
          .catch(() => {
            throw new Error('Occupation not found');
          });
      });
      const occupations: OccupationEntity[] = await Promise.all(occupationPromises);

      if (occupations.length == 0) {
        throw new Error('Occupations not found');
      }

      await this.profileRepository.update(profile.id, {
        occupations: occupations,
      });
      this.eventBus.publish(
        new UpdateOccupationsProfileEvent({
          listOfOccupationId: command.occupations,
          profileId: command.id,
        }),
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
