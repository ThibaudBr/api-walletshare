import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPriceByProductIdQuery } from '../../query/get-all-price-by-product-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceEntity } from '../../../../domain/entities/price.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllPriceByProductIdQuery)
export class GetAllPriceByProductIdQueryHandler implements IQueryHandler<GetAllPriceByProductIdQuery> {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllPriceByProductIdQuery): Promise<PriceEntity[]> {
    return await this.priceRepository
      .find({
        where: {
          product: {
            id: query.productId,
          },
        },
        relations: ['product'],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetAllPriceByProductIdQuery',
            localisation: 'priceRepository.find',
          }),
        );
        throw new Error('Error while fetching prices');
      });
  }
}
