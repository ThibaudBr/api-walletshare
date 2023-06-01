import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateStripeEventCommand } from '../../command/create-stripe-event.command';
import { CreateStripeEventEvent } from '../../event/create-stripe-event.event';
import { InjectRepository } from '@nestjs/typeorm';
import StripeEventEntity from '../../../../domain/entities/stripe-event.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(CreateStripeEventCommand)
export class CreateStripeEventCommandHandler implements ICommandHandler<CreateStripeEventCommand> {
  constructor(
    @InjectRepository(StripeEventEntity)
    private readonly stripEventRepository: Repository<StripeEventEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateStripeEventCommand): Promise<void> {
    const newStripEvent: StripeEventEntity = this.stripEventRepository.create({
      id: command.stripEventId,
    });
    await this.stripEventRepository.save(newStripEvent).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateStripEventCommandHandler',
          localisation: 'stripEventRepository.save',
          error: error.message,
        }),
      );
      throw new Error('StripEvent already exist');
    });

    await this.eventBus.publish(
      new CreateStripeEventEvent({
        stripEventId: newStripEvent.id,
      }),
    );
  }
}
