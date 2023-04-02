import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RestoreSocialNetworkCommand } from '../../command/restore-social-network.command';
import { SocialNetworkEntity } from '../../../domain/entities/social-network.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RestoreSocialNetworkEvent } from '../../event/restore-social-network.event';

@CommandHandler(RestoreSocialNetworkCommand)
export class RestoreSocialNetworkCommandHandler implements ICommandHandler<RestoreSocialNetworkCommand> {
  constructor(
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreSocialNetworkCommand): Promise<void> {
    await this.socialNetworkRepository
      .findOneOrFail({
        where: [{ id: command.id }],
        withDeleted: true,
      })
      .then(async socialNetwork => {
        await this.socialNetworkRepository
          .restore(socialNetwork.id)
          .then(async () => {
            await this.eventBus.publish(new RestoreSocialNetworkEvent(command.id));
          })
          .catch(() => {
            throw new Error('SocialNetwork not restored');
          });
      })
      .catch(() => {
        throw new Error('SocialNetwork not found');
      });
  }
}
