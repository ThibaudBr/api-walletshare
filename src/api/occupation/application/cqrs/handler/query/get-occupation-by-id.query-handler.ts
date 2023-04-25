import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOccupationByIdQuery } from '../../query/get-occupation-by-id.query';
import { OccupationDto } from '../../../../domain/dto/occupation.dto';
import { OccupationEntity } from '../../../../domain/entities/occupation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetOccupationByIdQuery)
export class GetOccupationByIdQueryHandler implements IQueryHandler<GetOccupationByIdQuery> {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetOccupationByIdQuery): Promise<OccupationDto> {
    return await this.occupationRepository
      .findOneOrFail({
        where: [{ id: query.occupationId }],
      })
      .then(occupation => {
        return new OccupationDto({ ...occupation });
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetOccupationByIdQueryHandler',
            localisation: 'Occupation',
            error: error.message,
          }),
        );
        throw new Error('Occupation not found');
      });
  }
}
