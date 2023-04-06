import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftDeleteCardCommand } from '../../command/soft-delete-card.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardEntity } from '../../../domain/entities/card.entity';
import { SoftDeleteCardEvent } from '../../event/soft-delete-card.event';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import {
  ErrorInvalidIdRuntimeException
} from "../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception";

@CommandHandler(SoftDeleteCardCommand)
export class SoftDeleteCardCommandHandler implements ICommandHandler<SoftDeleteCardCommand> {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftDeleteCardCommand): Promise<void> {
    try {
      await this.cardRepository
        .findOneOrFail({
          where: [{ id: command.id }],
        })
        .catch(() => {
          throw new ErrorInvalidIdRuntimeException('Card not found');
        });

      await this.cardRepository.softDelete(command.id);
      this.eventBus.publish(
        new SoftDeleteCardEvent({
          cardId: command.id,
        }),
      );
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'SoftDeleteCardCommandHandler',
          localisation: 'card',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
