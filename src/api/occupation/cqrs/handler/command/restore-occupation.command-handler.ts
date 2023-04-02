import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { RestoreOccupationCommand } from '../../command/restore-occupation.command';
import { InjectRepository } from '@nestjs/typeorm';
import { RestoreOccupationEvent } from '../../event/restore-occupation.event';
import { OccupationEntity } from '../../../domain/entities/occupation.entity';

@CommandHandler(RestoreOccupationCommand)
export class RestoreOccupationCommandHandler implements ICommandHandler<RestoreOccupationCommand> {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreOccupationCommand): Promise<void> {
    try {
      await this.occupationRepository
        .findOneOrFail({
          where: [{ id: command.occupationId }],
        })
        .catch(() => {
          throw new Error('Occupation not found');
        });

      await this.occupationRepository.restore(command.occupationId);
      this.eventBus.publish(
        new RestoreOccupationEvent({
          occupationId: command.occupationId,
        }),
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
