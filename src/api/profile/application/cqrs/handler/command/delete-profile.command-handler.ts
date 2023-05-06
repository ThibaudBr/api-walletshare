import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProfileCommand } from '../../command/delete-profile.command';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteProfileEvent } from '../../event/delete-profile.event';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(DeleteProfileCommand)
export class DeleteProfileCommandHandler implements ICommandHandler<DeleteProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const profile = await this.profileRepository
      .findOneOrFail({
        where: [{ id: command.id }],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'profileRepository.findOneOrFail',
            handler: 'DeleteProfileCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Profile not found');
      });
    await this.profileRepository.remove(profile).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'DeleteProfileCommandHandler',
          error: error.message,
          localisation: 'profileRepository.remove',
        }),
      );
    });
    await this.eventBus.publish(
      new DeleteProfileEvent({
        id: command.id,
      }),
    );
  }
}
