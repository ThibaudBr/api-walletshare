import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSocialNetworkCommand } from '../../command/update-social-network.command';
import { Repository } from 'typeorm';
import { UpdateSocialNetworkEvent } from '../../event/update-social-network.event';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialNetworkEntity } from '../../../domain/entities/social-network.entity';
import { validate } from 'class-validator';

@CommandHandler(UpdateSocialNetworkCommand)
export class UpdateSocialNetworkCommandHandler implements ICommandHandler<UpdateSocialNetworkCommand> {
  constructor(
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateSocialNetworkCommand): Promise<void> {
    await this.socialNetworkRepository.find().then((socialNetworkEntityList: SocialNetworkEntity[]) => {
      socialNetworkEntityList.forEach((socialNetwork: SocialNetworkEntity) => {
        if (socialNetwork.id != command.id && socialNetwork.name == command.name) throw new Error('Duplicated name');
      });
    });
    await this.socialNetworkRepository
      .findOneOrFail({
        where: [{ id: command.id }],
      })
      .then(async socialNetwork => {
        const err = await validate(new SocialNetworkEntity({ ...command }));
        if (err.length > 0) {
          throw err;
        }
        await this.socialNetworkRepository
          .update(socialNetwork.id, {
            ...command,
          })
          .then(async () => {
            await this.eventBus.publish(new UpdateSocialNetworkEvent(command.id));
          })
          .catch(() => {
            throw new Error('SocialNetwork not updated');
          });
      })
      .catch(error => {
        if (error instanceof Array) throw error;
        throw new Error('SocialNetwork not found');
      });
  }
}
