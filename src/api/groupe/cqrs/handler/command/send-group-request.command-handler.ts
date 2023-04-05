import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SendGroupRequestCommand } from '../../command/send-group-request.command';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRequestEntity } from '../../../domain/entities/group-request.entity';
import { Repository } from 'typeorm';
import { GroupEntity } from '../../../domain/entities/group.entity';
import { GroupMembershipEntity } from '../../../domain/entities/group-membership.entity';
import { CardEntity } from '../../../../card/domain/entities/card.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { GroupRequestStatusEnum } from '../../../domain/enum/group-request-status.enum';

@CommandHandler(SendGroupRequestCommand)
export class SendGroupRequestCommandHandler implements ICommandHandler<SendGroupRequestCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(GroupRequestEntity)
    private readonly groupRequestRepository: Repository<GroupRequestEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SendGroupRequestCommand): Promise<void> {
    const card = await this.cardRepository
      .findOneOrFail({
        relations: ['groupMembership', 'groupMembership.group'],
        where: [
          {
            id: command.cardId,
          },
        ],
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'SendGroupRequestCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });

    const group = await this.groupRepository
      .findOneOrFail({
        relations: ['groupMemberships', 'groupMemberships.card'],
        where: [
          {
            id: command.groupId,
          },
        ],
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'SendGroupRequestCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });

    if (group.members.filter(membership => membership.card.id === command.cardId).length > 0) {
      throw new Error('Card is already in this group');
    }

    const groupRequest = new GroupRequestEntity({
      card: card,
      group: group,
      status: GroupRequestStatusEnum.PENDING,
    });

    await this.groupRequestRepository
      .save(groupRequest)
      .then(async () => {
        await this.eventBus.publish(
          new SendGroupRequestCommand({
            cardId: command.cardId,
            groupId: command.groupId,
          }),
        );
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'SendGroupRequestCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Error while saving group request');
      });
  }
}
