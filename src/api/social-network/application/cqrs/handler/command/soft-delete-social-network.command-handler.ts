import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftDeleteSocialNetworkCommand } from '../../command/soft-delete-social-network.command';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialNetworkEntity } from '../../../../domain/entities/social-network.entity';
import { Repository } from 'typeorm';
import { SoftDeleteSocialNetworkEvent } from '../../event/soft-delete-social-network.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(SoftDeleteSocialNetworkCommand)
export class SoftDeleteSocialNetworkCommandHandler implements ICommandHandler<SoftDeleteSocialNetworkCommand> {
  constructor(
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftDeleteSocialNetworkCommand): Promise<void> {
    await this.socialNetworkRepository
      .findOneOrFail({
        where: [{ id: command.id }],
      })
      .then(async socialNetwork => {
        await this.socialNetworkRepository
          .softRemove(socialNetwork)
          .then(async () => {
            await this.eventBus.publish(new SoftDeleteSocialNetworkEvent(command.id));
          })
          .catch(async error => {
            await this.eventBus.publish(
              new ErrorCustomEvent({
                localisation: 'socialNetworkRepository.softRemove',
                handler: 'SoftDeleteSocialNetworkCommandHandler',
                error: error.message,
              }),
            );
            throw new Error('SocialNetwork not deleted');
          });
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'socialNetworkRepository.findOneOrFail',
            handler: 'SoftDeleteSocialNetworkCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('SocialNetwork not found');
      });
  }
}
