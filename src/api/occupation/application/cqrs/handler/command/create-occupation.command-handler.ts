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
    try {
      const occupationList: OccupationEntity[] = await this.occupationRepository.find();

      if (occupationList.length > 0) {
        occupationList.forEach(occupation => {
          if (occupation.name === command.createOccupationDto.name) {
            throw new Error('Duplicated name');
          }
        });
      }
      const newOccupationEntity: OccupationEntity = new OccupationEntity({
        ...command.createOccupationDto,
      });
      const err = await validate(newOccupationEntity);
      if (err.length > 0) {
        throw err;
      }

      return this.occupationRepository
        .save(newOccupationEntity)
        .then(occupationEntity => {
          this.eventBus.publish(
            new CreateOccupationEvent({
              occupationId: occupationEntity.id,
            }),
          );
          return new OccupationDto({
            ...occupationEntity,
          });
        })
        .catch(() => {
          throw new Error('Occupation not created');
        });
    } catch (e) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateOccupationCommandHandler',
          localisation: 'Occupation',
          error: e.message,
        }),
      );
      throw e;
    }
  }
}
