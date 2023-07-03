import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsUserIdOwnerOfMessageQuery } from '../../query/is-user-id-owner-of-message.query';
import { MessageEntity } from '../../../../domain/entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(IsUserIdOwnerOfMessageQuery)
export class IsUserIdOwnerOfMessageQueryHandler implements IQueryHandler<IsUserIdOwnerOfMessageQuery> {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: IsUserIdOwnerOfMessageQuery): Promise<boolean> {
    const message: MessageEntity = await this.messageRepository
      .findOneOrFail({
        relations: ['author', 'author.owner', 'author.owner.user'],
        where: {
          id: query.messageId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'IsUserIdOwnerOfMessageQueryHandler',
            localisation: 'MessageRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('Message not found');
      });

    return message.author.owner.user.id === query.userId;
  }
}
