import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateJoinedConversationCommand } from '../../command/create-joined-conversation.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { CardEntity } from '../../../../../card/domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { JoinedConversationEntity } from '../../../../domain/entities/joined-conversation.entity';
import { CreateJoinedConversationEvent } from '../../event/create-joined-conversation.event';

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
    @InjectRepository(JoinedConversationEntity)
    private readonly joinedConversationRepository: Repository<JoinedConversationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateJoinedConversationCommand): Promise<void> {
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
            error: error.message,
          }),
        );
        throw new Error('Profile not found');
      });

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
            error: error.message,
          }),
        );
        throw new Error('Conversation not found');
      });

    await this.joinedConversationRepository
      .find({
        relations: ['conversation', 'profile'],
        where: {
          conversation: {
            id: conversation.id,
          },
          profile: {
            id: profile.id,
          },
        },
      })
      .then(async joinedConversation => {
        if (joinedConversation) {
          await this.joinedConversationRepository.remove(joinedConversation).catch(async error => {
            await this.eventBus.publish(
              new ErrorCustomEvent({
                handler: 'CreateJoinedConversationCommandHandler',
                localisation: 'JoinedConversationEntity.remove',
                error: error.message,
              }),
            );
            throw new Error('JoinedConversation not removed');
          });
        }
      });
    const joinedConversation: JoinedConversationEntity = new JoinedConversationEntity({
      socketId: command.socketId,
      profile: profile,
      conversation: conversation,
    });
    await this.joinedConversationRepository.save(joinedConversation).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateJoinedConversationCommandHandler',
          localisation: 'JoinedConversationEntity.save',
          error: error.message,
        }),
      );
      throw new Error('JoinedConversation not saved');
    });

    await this.eventBus.publish(
      new CreateJoinedConversationEvent({
        conversationId: conversation.id,
        profileId: profile.id,
        socketId: command.socketId,
      }),
    );
  }
}
