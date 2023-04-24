import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftDeleteSocialNetworkCommand } from '../../command/soft-delete-social-network.command';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialNetworkEntity } from '../../../domain/entities/social-network.entity';
import { Repository } from 'typeorm';
import { SoftDeleteSocialNetworkEvent } from '../../event/soft-delete-social-network.event';

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
          .catch(() => {
            throw new Error('SocialNetwork not deleted');
          });
      })
      .catch(() => {
        throw new Error('SocialNetwork not found');
      });
  }
}
