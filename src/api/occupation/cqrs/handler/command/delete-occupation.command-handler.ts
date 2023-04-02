import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { OccupationEntity } from '../../../domain/entities/occupation.entity';
import { DeleteOccupationCommand } from '../../command/delete-occupation.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(DeleteOccupationCommand)
export class DeleteOccupationCommandHandler implements ICommandHandler<DeleteOccupationCommand> {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteOccupationCommand): Promise<void> {
    try {
      const occupation = await this.occupationRepository
        .findOneOrFail({
          where: [{ id: command.occupationId }],
        })
        .catch(() => {
          throw new Error('Occupation not found');
        });
      await this.occupationRepository.delete(occupation.id).catch(() => {
        throw new Error('Occupation not deleted');
      });
    } catch (e) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'DeleteOccupationCommandHandler',
          localisation: 'Occupation',
          error: e.message,
        }),
      );
      throw e;
    }
  }
}
