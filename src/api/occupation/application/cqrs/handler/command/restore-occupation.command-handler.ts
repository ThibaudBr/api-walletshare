import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { RestoreOccupationCommand } from '../../command/restore-occupation.command';
import { InjectRepository } from '@nestjs/typeorm';
import { RestoreOccupationEvent } from '../../event/restore-occupation.event';
import { OccupationEntity } from '../../../../domain/entities/occupation.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RestoreOccupationCommand)
export class RestoreOccupationCommandHandler implements ICommandHandler<RestoreOccupationCommand> {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreOccupationCommand): Promise<void> {
    try {
      const occupation: OccupationEntity = await this.occupationRepository
        .findOneOrFail({
          withDeleted: true,
          where: [{ id: command.occupationId }],
        })
        .catch(() => {
          throw new Error('Occupation not found');
        });
      if (!occupation.deletedAt) throw new Error('Occupation is not soft deleted');

      await this.occupationRepository.restore(command.occupationId);
      this.eventBus.publish(
        new RestoreOccupationEvent({
          occupationId: command.occupationId,
        }),
      );
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'RestoreOccupationCommandHandler',
          localisation: 'occupation',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
