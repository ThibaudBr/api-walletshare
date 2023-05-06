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
    const socialNetworks = await this.socialNetworkRepository.find().catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'socialNetworkRepository.find',
          handler: 'CreateSocialNetworkCommandHandler',
          error: error.message,
        }),
      );
      throw new Error('Social network not found');
    });
    if (socialNetworks.length > 0) {
      for (const socialNetwork of socialNetworks) {
        if (socialNetwork.name === command.name) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'CreateSocialNetworkCommandHandler',
              error: 'Duplicated name',
              localisation: 'socialNetworkRepository.find',
            }),
          );
          throw new Error('Duplicated name');
        }
      }
    }

    const newSocialNetworkEntity: SocialNetworkEntity = new SocialNetworkEntity({
      ...command,
    });

    const err = await validate(newSocialNetworkEntity);
    if (err.length > 0) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateSocialNetworkCommandHandler',
          error: err.map(e => e.constraints).toString(),
          localisation: 'validate',
        }),
      );
      throw err;
    }

    this.socialNetworkRepository
      .save(newSocialNetworkEntity)
      .then(async socialNetworkEntity => {
        await this.eventBus.publish(new CreateSocialNetworkEvent(socialNetworkEntity.id));
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateSocialNetworkCommandHandler',
            error: error.message,
            localisation: 'socialNetworkRepository.save',
          }),
        );
        throw new Error('SocialNetwork not created');
      });
  }
}
