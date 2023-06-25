import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetConversationByIdQuery } from '../../query/get-conversation-by-id.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { GroupMembershipEntity } from '../../../../../groupe/domain/entities/group-membership.entity';
import { MessageEntity } from '../../../../domain/entities/message.entity';

@QueryHandler(GetConversationByIdQuery)
export class GetConversationByIdQueryHandler implements IQueryHandler<GetConversationByIdQuery> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipEntityRepository: Repository<GroupMembershipEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetConversationByIdQuery): Promise<ConversationEntity> {
    return await this.conversationRepository
      .findOneOrFail({
        relations: [
          'joinedProfiles',
          'joinedProfiles.profile',
          'joinedProfiles.profile.user',
          'connectedCard',
          'connectedCard.cardEntityOne',
          'connectedCard.cardEntityOne.owner',
          'connectedCard.cardEntityOne.owner.user',
          'connectedCard.cardEntityTwo',
          'connectedCard.cardEntityTwo.owner',
          'connectedCard.cardEntityTwo.owner.user',
          'group',
        ],
        where: {
          id: query.conversationId,
        },
      })
      .catch(async err => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetConversationByIdQueryHandler',
            localisation: 'conversation',
            error: err,
          }),
        );
        throw new Error('An error occurred while getting conversation by id');
      })
      .then(async conversation => {
        if (!conversation) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'GetConversationByIdQueryHandler',
              localisation: 'conversation',
              error: 'Conversation not found',
            }),
          );
          throw new Error('Conversation not found');
        }
        conversation.messages = await this.messageRepository.find({
          where: { conversation: { id: conversation.id } },
          relations: ['author', 'author.owner'],
          order: { createdAt: 'DESC' },
          take: 30,
          skip: 0,
        });
        if (conversation.group) {
          conversation.group.members = await this.groupMembershipEntityRepository.find({
            relations: ['group', 'card', 'card.owner', 'card.owner.user'],
            where: [
              {
                group: {
                  id: conversation.group.id,
                },
              },
            ],
          });
        }
        return conversation;
      });
  }
}
