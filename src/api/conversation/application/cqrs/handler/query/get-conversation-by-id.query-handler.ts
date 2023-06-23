import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetConversationByIdQuery } from '../../query/get-conversation-by-id.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { GroupEntity } from '../../../../../groupe/domain/entities/group.entity';

@QueryHandler(GetConversationByIdQuery)
export class GetConversationByIdQueryHandler implements IQueryHandler<GetConversationByIdQuery> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetConversationByIdQuery): Promise<ConversationEntity> {
    return await this.conversationRepository
      .find({
        relations: [
          'joinedProfiles',
          'joinedProfiles.profile',
          'joinedProfiles.profile.user',
          'connectedCard',
          'connectedCard.cardEntityOne',
          'connectedCard.cardEntityOne.owner',
          'connectedCard.cardEntityTwo',
          'connectedCard.cardEntityTwo.owner',
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
        if (conversation[0].group) {
          conversation[0].group = await this.groupRepository.findOneOrFail({
            relations: ['members', 'members.card', 'members.card.owner', 'members.card.owner.user'],
            where: [
              {
                id: conversation[0].group.id,
              },
            ],
          });
        }
        console.log('conversation.group?.members');
        console.log(conversation[0].group?.members);
        return conversation[0];
      });
  }
}
