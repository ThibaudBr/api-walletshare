import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OccupationDto } from '../../../../domain/dto/occupation.dto';
import { GetOccupationWithCriteriaQuery } from '../../query/get-occupation-with-criteria.query';
import { InjectRepository } from '@nestjs/typeorm';
import { OccupationEntity } from '../../../../domain/entities/occupation.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetOccupationWithCriteriaQuery)
export class GetOccupationWithCriteriaQueryHandler implements IQueryHandler<GetOccupationWithCriteriaQuery> {
  constructor(
    @InjectRepository(OccupationEntity)
    private readonly occupationRepository: Repository<OccupationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetOccupationWithCriteriaQuery): Promise<OccupationDto[]> {
    const queryBuilder = this.occupationRepository.createQueryBuilder('occupation');

    if (query.criteria.isDeleted) {
      queryBuilder.setFindOptions({ withDeleted: true });
    }

    if (query.criteria.name) {
      queryBuilder.where('occupation.name = :nameOccupation', {
        nameOccupation: query.criteria.name,
      });
    }

    const occupations = await queryBuilder.getMany().catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'GetOccupationWithCriteriaQueryHandler',
          localisation: 'OccupationRepository.find',
          error: error.message,
        }),
      );
      throw new Error('Error while getting all occupations');
    });

    return occupations.map(
      occupation =>
        new OccupationDto({
          ...occupation,
        }),
    );
  }
}
