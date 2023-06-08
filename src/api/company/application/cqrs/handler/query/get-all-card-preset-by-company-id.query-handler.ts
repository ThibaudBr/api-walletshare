import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { GetAllCardPresetByCompanyIdQuery } from '../../query/get-all-card-preset-by-company-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CardPresetEntity } from '../../../../domain/entities/card-preset.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllCardPresetByCompanyIdQuery)
export class GetAllCardPresetByCompanyIdQueryHandler implements IQueryHandler<GetAllCardPresetByCompanyIdQuery> {
  constructor(
    @InjectRepository(CardPresetEntity)
    private readonly cardPresetRepository: Repository<CardPresetEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllCardPresetByCompanyIdQuery): Promise<CardPresetEntity[]> {
    return await this.cardPresetRepository
      .find({
        relations: ['company', 'media'],
        where: {
          company: {
            id: query.companyId,
          },
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetAllCardPresetByCompanyIdQueryHandler',
            localisation: 'cardPresetRepository.find',
          }),
        );
        throw new Error('Card preset not found');
      });
  }
}
