import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProfileResponse } from '../../../domain/response/profile.response';
import { CreateProfileCommand } from '../../command/create-profile.command';
import { ProfileEntity } from '../../../domain/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { CreateProfileEvent } from '../../event/create-profile.event';
import { OccupationEntity } from '../../../../occupation/domain/entities/occupation.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(CreateProfileCommand)
export class CreateProfileCommandHandler implements ICommandHandler<CreateProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProfileCommand): Promise<void> {
    try {
      if (!command.userId) throw new Error('User not found');
      const user = await this.userRepository
        .findOneOrFail({
          where: { id: command.userId },
        })
        .catch(() => {
          throw new Error('User not found');
        });

      const newProfile = new ProfileEntity({
        user: user,
        ...command.createProfileDto,
      });

      if (command.occupationsId) {
        if (command.occupationsId.length > 0) {
          const occupationPromises: Promise<OccupationEntity>[] = command.occupationsId.map(async occupationId => {
            return await this.occupationRepository
              .findOneOrFail({
                where: [{ id: occupationId }],
              })
              .catch(() => {
                throw new Error('Occupation not found');
              });
          });
          const occupations: OccupationEntity[] = await Promise.all(occupationPromises);

          if (occupations.length > 0) {
            newProfile.occupations = occupations;
          }
        }
      }

      const err = await validate(newProfile);
      if (err.length > 0) {
        throw err;
      }

      const savedProfile = await this.profileRepository.save(newProfile).then(profile => {
        return new ProfileResponse({
          ...profile,
        });
      });
      this.eventBus.publish(
        new CreateProfileEvent({
          profileResponse: new ProfileResponse(savedProfile),
        }),
      );
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateProfileCommandHandler',
          localisation: 'Profile',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
