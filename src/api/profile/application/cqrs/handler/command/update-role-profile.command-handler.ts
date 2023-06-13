import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRoleProfileCommand } from '../../command/update-role-profile.command';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { UpdateRoleProfileEvent } from '../../event/update-role-profile.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(UpdateRoleProfileCommand)
export class UpdateRoleProfileCommandHandler implements ICommandHandler<UpdateRoleProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateRoleProfileCommand): Promise<void> {
    const profileEntity: ProfileEntity = await this.profileRepository
      .findOneOrFail({
        where: {
          id: command.profileId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'UpdateRoleProfileCommandHandler',
            error: error.message,
            localisation: 'profile.find-one-or-fail',
          }),
        );
        throw new Error('Profile not found');
      });

    profileEntity.roleProfile = command.roleProfileEnum;
    await this.profileRepository.save(profileEntity).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'UpdateRoleProfileCommandHandler',
          error: error.message,
          localisation: 'profile.update',
        }),
      );
      throw new Error('Profile not updated');
    });

    await this.eventBus.publish(
      new UpdateRoleProfileEvent({
        roleProfileEnum: command.roleProfileEnum,
        profileId: command.profileId,
      }),
    );
  }
}
