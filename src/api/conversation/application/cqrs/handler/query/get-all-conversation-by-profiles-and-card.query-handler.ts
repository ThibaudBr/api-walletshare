import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllConversationByProfilesAndCardQuery } from '../../query/get-all-conversation-by-profiles-and-card.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { MessageEntity } from '../../../../domain/entities/message.entity';
import { GroupEntity } from '../../../../../groupe/domain/entities/group.entity';

@QueryHandler(GetAllConversationByProfilesAndCardQuery)
export class GetAllConversationByProfilesAndCardQueryHandler
  implements IQueryHandler<GetAllConversationByProfilesAndCardQuery>
{
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllConversationByProfilesAndCardQuery): Promise<ConversationEntity[]> {
    const conversationToReturn: ConversationEntity[] = [];
    for (const profileId of query.profilesId) {
      const conversations: ConversationEntity[] = await this.conversationRepository
        .find({
          relations: [
            'connectedCard',
            'connectedCard.cardEntityOne',
            'connectedCard.cardEntityOne.owner.user',
            'connectedCard.cardEntityTwo',
            'connectedCard.cardEntityTwo.owner.user',
            'group',
            'group.members',
            'group.members.card',
            'group.members.card.owner',
            'group.members.card.owner.user',
            'joinedProfiles',
            'joinedProfiles.profile',
            'joinedProfiles.profile.user',
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
        })
        .then(async conversations => {
          for (const conversation of conversations) {
            conversation.messages = await this.messageRepository.find({
              where: { conversation: { id: conversation.id } },
              relations: ['author', 'author.owner'],
              order: { createdAt: 'DESC' },
              take: 10,
              skip: 0,
            });
            if (conversation.group) {
              conversation.group = await this.groupRepository.findOneOrFail({
                where: { id: conversation.group.id },
                relations: ['members', 'members.card', 'members.card.owner', 'members.card.owner.user'],
              });
            }
          }
          return conversations;
        });
      conversationToReturn.push(...conversations);
    }
    return conversationToReturn;
  }
}
