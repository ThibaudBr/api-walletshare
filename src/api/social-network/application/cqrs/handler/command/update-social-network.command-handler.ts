import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSocialNetworkCommand } from '../../command/update-social-network.command';
import { Repository } from 'typeorm';
import { UpdateSocialNetworkEvent } from '../../event/update-social-network.event';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialNetworkEntity } from '../../../../domain/entities/social-network.entity';
import { validate } from 'class-validator';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(UpdateSocialNetworkCommand)
export class UpdateSocialNetworkCommandHandler implements ICommandHandler<UpdateSocialNetworkCommand> {
  constructor(
    @InjectRepository(SocialNetworkEntity)
    private readonly socialNetworkRepository: Repository<SocialNetworkEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateSocialNetworkCommand): Promise<void> {
    await this.socialNetworkRepository.find().then(async (socialNetworkEntityList: SocialNetworkEntity[]) => {
      for (const socialNetwork of socialNetworkEntityList) {
        if (socialNetwork.id != command.id && socialNetwork.name == command.name) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              localisation: 'socialNetworkRepository.find',
              handler: 'UpdateSocialNetworkCommandHandler',
              error: 'Duplicated name',
            }),
          );
          throw new Error('Duplicated name');
        }
      }
    });
    await this.socialNetworkRepository
      .findOneOrFail({
        where: [{ id: command.id }],
      })
      .then(async socialNetwork => {
        const err = await validate(new SocialNetworkEntity({ ...command }));
        if (err.length > 0) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'UpdateSocialNetworkCommandHandler',
              error: err.map(e => e.constraints).toString(),
              localisation: 'validate',
            }),
          );
          throw err;
        }
        await this.socialNetworkRepository
          .update(socialNetwork.id, {
            ...command,
          })
          .then(async () => {
            await this.eventBus.publish(new UpdateSocialNetworkEvent(command.id));
          })
          .catch(async error => {
            await this.eventBus.publish(
              new ErrorCustomEvent({
                localisation: 'socialNetworkRepository.update',
                handler: 'UpdateSocialNetworkCommandHandler',
                error: error.message,
              }),
            );
            throw new Error('SocialNetwork not updated');
          });
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'socialNetworkRepository.findOneOrFail',
            handler: 'UpdateSocialNetworkCommandHandler',
            error: error.message,
          }),
        );
        if (error instanceof Array) throw error;
        throw new Error('SocialNetwork not found');
      });
  }
}
