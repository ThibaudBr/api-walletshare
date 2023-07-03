import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { GetAllPriceQuery } from '../../query/get-all-price.query';
import { PriceEntity } from '../../../../domain/entities/price.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllPriceQuery)
export class GetAllPriceQueryHandler implements IQueryHandler<GetAllPriceQuery> {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<PriceEntity[]> {
    return await this.priceRepository.find().catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'GetAllPriceQueryHandler',
          localisation: 'priceRepository.find',
        }),
      );
      throw new Error('Error while fetching prices');
    });
  }
}
