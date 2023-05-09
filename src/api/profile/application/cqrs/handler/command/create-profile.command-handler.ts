import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProfileResponse } from '../../../../web/response/profile.response';
import { CreateProfileCommand } from '../../command/create-profile.command';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { CreateProfileEvent } from '../../event/create-profile.event';
import { OccupationEntity } from '../../../../../occupation/domain/entities/occupation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

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

  async execute(command: CreateProfileCommand): Promise<string> {
    if (!command.userId) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateProfileCommandHandler',
          error: 'UserId not found',
          localisation: 'command.userId',
        }),
      );
      throw new Error('User not found');
    }
    const user = await this.userRepository
      .findOneOrFail({
        where: { id: command.userId },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateProfileCommandHandler',
            error: error.message,
            localisation: 'userRepository.findOneOrFail',
          }),
        );
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
            .catch(async error => {
              await this.eventBus.publish(
                new ErrorCustomEvent({
                  handler: 'CreateProfileCommandHandler',
                  error: error.message,
                  localisation: 'occupationRepository.findOneOrFail',
                }),
              );
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
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateProfileCommandHandler',
          error: err.map(e => e.constraints).toString(),
          localisation: 'validate',
        }),
      );
      throw err;
    }

    const savedProfile = await this.profileRepository
      .save(newProfile)
      .then(profile => {
        return new ProfileResponse({
          ...profile,
        });
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateProfileCommandHandler',
            error: error.message,
            localisation: 'profileRepository.save',
          }),
        );
        throw new Error('Profile not saved');
      });
    await this.eventBus.publish(
      new CreateProfileEvent({
        profileResponse: new ProfileResponse(savedProfile),
      }),
    );
    return savedProfile.id;
  }
}
