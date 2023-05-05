import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllOccupationQuery } from '../../query/get-all-occupation.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OccupationEntity } from '../../../../domain/entities/occupation.entity';
import { OccupationDto } from '../../../../domain/dto/occupation.dto';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllOccupationQuery)
export class GetAllOccupationQueryHandler implements IQueryHandler<GetAllOccupationQuery> {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<OccupationDto[]> {
    return await this.occupationRepository
      .find()
      .then(occupations => {
        return occupations.map(occupation => {
          return new OccupationDto(occupation);
        });
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllOccupationQueryHandler',
            localisation: 'Occupation',
            error: error.message,
          }),
        );
        throw new Error('Error while getting all occupations');
      });
  }
}
