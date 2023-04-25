import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateSocialNetworkCommand } from '../../command/create-social-network.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialNetworkEntity } from '../../../../domain/entities/social-network.entity';
import { CreateSocialNetworkEvent } from '../../event/create-social-network.event';
import { validate } from 'class-validator';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(CreateSocialNetworkCommand)
export class CreateSocialNetworkCommandHandler implements ICommandHandler<CreateSocialNetworkCommand> {
  constructor(
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateSocialNetworkCommand): Promise<void> {
    try {
      const socialNetwork = await this.socialNetworkRepository.find();
      if (socialNetwork.length > 0) {
        socialNetwork.forEach(socialNetwork => {
          if (socialNetwork.name === command.name) {
            throw new Error('Duplicated name');
          }
        });
      }

      const newSocialNetworkEntity: SocialNetworkEntity = new SocialNetworkEntity({
        ...command,
      });

      const err = await validate(newSocialNetworkEntity);
      if (err.length > 0) {
        throw err;
      }

      this.socialNetworkRepository
        .save(newSocialNetworkEntity)
        .then(socialNetworkEntity => {
          this.eventBus.publish(new CreateSocialNetworkEvent(socialNetworkEntity.id));
        })
        .catch(() => {
          throw new Error('SocialNetwork not created');
        });
    } catch (e) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateSocialNetworkCommandHandler',
          localisation: 'SocialNetwork',
          error: e.message,
        }),
      );
      throw e;
    }
  }
}
