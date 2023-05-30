import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserAndProfileFromSocketQuery } from '../../query/get-user-and-profile-from-socket.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';

@QueryHandler(GetUserAndProfileFromSocketQuery)
export class GetUserAndProfileFromSocketQueryHandler implements IQueryHandler<GetUserAndProfileFromSocketQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetUserAndProfileFromSocketQuery): Promise<UserEntity[]> {
    return await this.userEntityRepository
      .find({
        relations: [
          'profiles',
          'profiles.personalCards',
          'profiles.personalCards.connectedCardOne.cardEntityOne',
          'profiles.personalCards.connectedCardOne.cardEntityOne.owner',
          'profiles.personalCards.connectedCardOne.cardEntityTwo',
          'profiles.personalCards.connectedCardOne.cardEntityTwo.owner',
          'profiles.personalCards.connectedCardOne.conversation.joinedProfiles',
          'profiles.personalCards.connectedCardTwo.cardEntityOne',
          'profiles.personalCards.connectedCardTwo.cardEntityOne.owner',
          'profiles.personalCards.connectedCardTwo.cardEntityTwo',
          'profiles.personalCards.connectedCardTwo.cardEntityTwo.owner',
          'profiles.personalCards.connectedCardTwo.conversation.joinedProfiles',
          'profiles.personalCards.group',
          'profiles.personalCards.group.members',
          'profiles.personalCards.group.members.card',
          'profiles.personalCards.group.members.card.owner',
          'profiles.personalCards.group.conversation.joinedProfiles',
        ],
        where: [
          {
            profiles: {
              personalCards: {
                connectedCardOne: {
                  conversation: {
                    joinedProfiles: {
                      socketId: query.socketId,
                    },
                  },
                },
              },
            },
          },
          {
            profiles: {
              personalCards: {
                connectedCardTwo: {
                  conversation: {
                    joinedProfiles: {
                      id: query.socketId,
                    },
                  },
                },
              },
            },
          },
          {
            profiles: {
              personalCards: {
                groupMemberships: {
                  group: {
                    conversation: {
                      joinedProfiles: {
                        socketId: query.socketId,
                      },
                    },
                  },
                },
              },
            },
          },
        ],
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
