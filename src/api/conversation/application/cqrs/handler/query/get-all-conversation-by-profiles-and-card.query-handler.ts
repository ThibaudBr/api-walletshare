import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllConversationByProfilesAndCardQuery } from '../../query/get-all-conversation-by-profiles-and-card.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllConversationByProfilesAndCardQuery)
export class GetAllConversationByProfilesAndCardQueryHandler
  implements IQueryHandler<GetAllConversationByProfilesAndCardQuery>
{
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllConversationByProfilesAndCardQuery): Promise<ConversationEntity[]> {
    const conversationToReturn: ConversationEntity[] = [];
    for (const profileId of query.profilesId) {
      const conversation: ConversationEntity[] = await this.conversationRepository
        .find({
          relations: [
            'connectedCard',
            'connectedCard.cardEntityOne',
            'connectedCard.cardEntityOne.owner',
            'connectedCard.cardEntityTwo',
            'connectedCard.cardEntityTwo.owner',
            'group',
            'group.members',
            'group.members.card',
            'group.members.card.owner',
          ],
          where: [
            { connectedCard: { cardEntityOne: { owner: { id: profileId } } } },
            { connectedCard: { cardEntityTwo: { owner: { id: profileId } } } },
            { group: { members: { card: { owner: { id: profileId } } } } },
          ],
        })
        .catch(async err => {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'GetAllConversationByProfilesAndCardQueryHandler',
              localisation: 'conversation',
              error: err,
            }),
          );
          throw new Error('An error occurred while getting all conversation by profiles and card');
        });
      conversationToReturn.push(...conversation);
    }
    return conversationToReturn;
  }
}
