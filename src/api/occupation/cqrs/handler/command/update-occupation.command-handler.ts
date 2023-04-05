import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OccupationEntity } from '../../../domain/entities/occupation.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { InvalidClassException } from '@nestjs/core/errors/exceptions/invalid-class.exception';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
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
    try {
      const occupationList: OccupationEntity[] = await this.occupationRepository.find();

      if (occupationList.length > 0) {
        occupationList.forEach(occupation => {
          if (occupation.name === command.updateOccupationDto.name && occupation.id !== command.occupationId) {
            throw new Error('Duplicated name');
          }
        });
      }

      const updatedOccupationEntity: OccupationEntity = await this.occupationRepository
        .findOneOrFail({
          where: [{ id: command.occupationId }],
        })
        .catch(() => {
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
        throw new InvalidClassException('Parameter not validate');
      }

      await this.occupationRepository
        .update(command.occupationId, updatedOccupationEntity)
        .catch(() => {
          throw new Error('Occupation not updated');
        })
        .then(async () => {
          await this.eventBus.publish(
            new UpdateOccupationEvent({
              occupationId: command.occupationId,
            }),
          );
        });
    } catch (e) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'UpdateOccupationCommandHandler',
          localisation: 'Occupation',
          error: e.message,
        }),
      );
      throw e;
    }
  }
}
