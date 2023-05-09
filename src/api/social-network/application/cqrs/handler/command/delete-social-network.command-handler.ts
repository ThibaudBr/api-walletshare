import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSocialNetworkCommand } from '../../command/delete-social-network.command';
import { SocialNetworkEntity } from '../../../../domain/entities/social-network.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteSocialNetworkEvent } from '../../event/delete-social-network.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(DeleteSocialNetworkCommand)
export class DeleteSocialNetworkCommandHandler implements ICommandHandler<DeleteSocialNetworkCommand> {
  constructor(
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteSocialNetworkCommand): Promise<void> {
    await this.socialNetworkRepository
      .findOneOrFail({
        withDeleted: true,
        where: [{ id: command.id }],
      })
      .then(async socialNetwork => {
        await this.socialNetworkRepository
          .delete(socialNetwork.id)
          .then(async () => {
            await this.eventBus.publish(new DeleteSocialNetworkEvent(socialNetwork.id));
          })
          .catch(() => {
            throw new Error('SocialNetwork not deleted');
          });
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'socialNetworkRepository.findOneOrFail',
            handler: 'DeleteSocialNetworkCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('SocialNetwork not found');
      });
  }
}
