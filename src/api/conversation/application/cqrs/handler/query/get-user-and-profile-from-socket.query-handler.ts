import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserAndProfileFromSocketQuery } from '../../query/get-user-and-profile-from-socket.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from '../../../../domain/entities/conversation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetUserAndProfileFromSocketQuery)
export class GetUserAndProfileFromSocketQueryHandler implements IQueryHandler<GetUserAndProfileFromSocketQuery> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetUserAndProfileFromSocketQuery): Promise<ConversationEntity[]> {
    return await this.conversationRepository
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
          'joinedProfiles',
        ],
        where: {
          joinedProfiles: {
            socketId: query.socketId,
          },
        },
      })
      .catch(async err => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetUserAndProfileFromSocketQueryHandler',
            localisation: 'conversation',
            error: err,
          }),
        );
        throw new Error('An error occurred while getting user and profile from socket');
      });
  }
}
