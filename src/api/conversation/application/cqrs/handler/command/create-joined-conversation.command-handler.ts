import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateJoinedConversationCommand } from '../../command/create-joined-conversation.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { CardEntity } from '../../../../../card/domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(CreateJoinedConversationCommand)
export class CreateJoinedConversationCommandHandler implements ICommandHandler<CreateJoinedConversationCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateJoinedConversationCommand): Promise<void> {
    const user: UserEntity = await this.userRepository
      .findOneOrFail({
        where: {
          id: command.userId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateJoinedConversationCommandHandler',
            localisation: 'UserEntity.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('User not found');
      });

    const profile: ProfileEntity = await this.profileRepository
      .findOneOrFail({
        where: {
          id: command.profileEntity.id,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateJoinedConversationCommandHandler',
            localisation: 'ProfileEntity.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Profile not found');
      });
    let card = undefined;
    if (command.cardId) {
      card = await this.cardRepository
        .findOneOrFail({
          where: {
            id: command.cardId,
          },
        })
        .catch(async error => {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'CreateJoinedConversationCommandHandler',
              localisation: 'CardEntity.findOneOrFail',
              error: error,
            }),
          );
          throw new Error('Card not found');
        });
    }

    const conversation: ConversationEntity = await this.conversationRepository
      .findOneOrFail({
        where: {
          id: command.conversationEntity.id,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateJoinedConversationCommandHandler',
            localisation: 'ConversationEntity.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Conversation not found');
      });

    // TODO: finir la fonctionnalité de rejoindre une conversation
    throw new Error('Not implemented');
  }
}
