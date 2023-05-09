import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOccupationCommand } from '../../command/create-occupation.command';
import { InjectRepository } from '@nestjs/typeorm';
import { OccupationEntity } from '../../../../domain/entities/occupation.entity';
import { Repository } from 'typeorm';
import { OccupationDto } from '../../../../domain/dto/occupation.dto';
import { validate } from 'class-validator';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { CreateOccupationEvent } from '../../event/create-occupation.event';

@CommandHandler(CreateOccupationCommand)
export class CreateOccupationCommandHandler implements ICommandHandler<CreateOccupationCommand> {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateOccupationCommand): Promise<OccupationDto> {
    const occupationList: OccupationEntity[] = await this.occupationRepository.find().catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'occupationRepository.find',
          handler: 'CreateOccupationCommandHandler',
          error: error.message,
        }),
      );
      throw error;
    });

    if (occupationList.length > 0) {
      for (const occupation of occupationList) {
        if (occupation.name === command.createOccupationDto.name) {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              localisation: 'occupationList.forEach',
              handler: 'CreateOccupationCommandHandler',
              error: 'Duplicated name',
            }),
          );
          throw new Error('Duplicated name');
        }
      }
    }
    const newOccupationEntity: OccupationEntity = new OccupationEntity({
      ...command.createOccupationDto,
    });
    const err = await validate(newOccupationEntity);
    if (err.length > 0) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'validate',
          handler: 'CreateOccupationCommandHandler',
          error: err
            .map(e => e.toString())
            .join(', ')
            .toString(),
        }),
      );
      throw err;
    }

    return this.occupationRepository
      .save(newOccupationEntity)
      .then(async occupationEntity => {
        await this.eventBus.publish(
          new CreateOccupationEvent({
            occupationId: occupationEntity.id,
          }),
        );
        return new OccupationDto({
          ...occupationEntity,
        });
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'occupationRepository.save',
            handler: 'CreateOccupationCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Occupation not created');
      });
  }
}
