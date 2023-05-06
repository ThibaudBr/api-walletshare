import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OccupationEntity } from '../../../../domain/entities/occupation.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { UpdateOccupationCommand } from '../../command/update-occupation.command';
import { UpdateOccupationEvent } from '../../event/update-occupation.event';

@CommandHandler(UpdateOccupationCommand)
export class UpdateOccupationCommandHandler implements ICommandHandler<UpdateOccupationCommand> {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateOccupationCommand): Promise<void> {
    const occupationList: OccupationEntity[] = await this.occupationRepository.find().catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'occupationRepository.find',
          handler: 'UpdateOccupationCommandHandler',
          error: error.message,
        }),
      );
      throw new Error('Occupation not found');
    });

    if (occupationList.length > 0) {
      for (const occupation of occupationList) {
        if (occupation.name === command.updateOccupationDto.name && occupation.id !== command.occupationId) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              localisation: 'occupationRepository.find',
              handler: 'UpdateOccupationCommandHandler',
              error: 'Duplicated name',
            }),
          );
          throw new Error('Duplicated name');
        }
      }
    }

    const updatedOccupationEntity: OccupationEntity = await this.occupationRepository
      .findOneOrFail({
        where: [{ id: command.occupationId }],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'occupationRepository.findOneOrFail',
            handler: 'UpdateOccupationCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Occupation not found');
      })
      .then(occupationEntity => {
        return new OccupationEntity({
          ...occupationEntity,
          ...command.updateOccupationDto,
        });
      });
    const err = await validate(updatedOccupationEntity);
    if (err.length > 0) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'validate',
          handler: 'UpdateOccupationCommandHandler',
          error: err
            .map(e => e.toString())
            .join(', ')
            .toString(),
        }),
      );
      throw err;
    }

    await this.occupationRepository
      .update(command.occupationId, updatedOccupationEntity)
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'occupationRepository.update',
            handler: 'UpdateOccupationCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Occupation not updated');
      })
      .then(async () => {
        await this.eventBus.publish(
          new UpdateOccupationEvent({
            occupationId: command.occupationId,
          }),
        );
      });
  }
}
