import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPriceByStripePriceIdQuery } from '../../query/get-price-by-stripe-price-id.query';
import { PriceEntity } from '../../../../domain/entities/price.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetPriceByStripePriceIdQuery)
export class GetPriceByStripePriceIdQueryHandler implements IQueryHandler<GetPriceByStripePriceIdQuery> {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetPriceByStripePriceIdQuery): Promise<PriceEntity> {
    return await this.priceRepository
      .findOneOrFail({
        relations: ['product'],
        where: {
          stripePriceId: query.stripePriceId,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'priceRepository.findOne',
            handler: 'GetPriceByStripePriceIdQueryHandler',
            error: error.message,
          }),
        );
        throw new Error('Price not found');
      });
  }
}
