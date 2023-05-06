import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { OccupationEntity } from '../../../../domain/entities/occupation.entity';
import { DeleteOccupationCommand } from '../../command/delete-occupation.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { DeleteOccupationEvent } from '../../event/delete-occupation.event';

@CommandHandler(DeleteOccupationCommand)
export class DeleteOccupationCommandHandler implements ICommandHandler<DeleteOccupationCommand> {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteOccupationCommand): Promise<void> {
    const occupation = await this.occupationRepository
      .findOneOrFail({
        withDeleted: true,
        where: [{ id: command.occupationId }],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'occupationRepository.findOneOrFail',
            handler: 'DeleteOccupationCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Occupation not found');
      });
    await this.occupationRepository.remove(occupation).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'occupationRepository.remove',
          handler: 'DeleteOccupationCommandHandler',
          error: error.message,
        }),
      );
      throw new Error('Occupation not found');
    });
    await this.eventBus.publish(new DeleteOccupationEvent({ occupationId: occupation.id }));
  }
}
