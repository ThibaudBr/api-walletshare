import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { SoftDeleteOccupationEvent } from '../../event/soft-delete-occupation.event';
import { SoftDeleteOccupationCommand } from '../../command/soft-delete-occupation.command';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';
import { OccupationEntity } from '../../../../domain/entities/occupation.entity';

@CommandHandler(SoftDeleteOccupationCommand)
export class SoftDeleteOccupationCommandHandler implements ICommandHandler<SoftDeleteOccupationCommand> {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftDeleteOccupationCommand): Promise<void> {
    const occupation = await this.occupationRepository
      .findOneOrFail({
        where: [{ id: command.occupationId }],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'occupationRepository.findOneOrFail',
            handler: 'SoftDeleteOccupationCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Occupation not found');
      });
    await this.occupationRepository.softRemove(occupation).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'occupationRepository.softRemove',
          handler: 'SoftDeleteOccupationCommandHandler',
          error: error.message,
        }),
      );
      throw new Error('Occupation not soft deleted');
    });
    await this.eventBus.publish(
      new SoftDeleteOccupationEvent({
        occupationId: command.occupationId,
      }),
    );
  }
}
