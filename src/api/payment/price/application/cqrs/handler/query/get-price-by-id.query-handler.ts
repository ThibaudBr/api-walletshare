import { GetPriceByIdQuery } from '../../query/get-price-by-id.query';
import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceEntity } from '../../../../domain/entities/price.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetPriceByIdQuery)
export class GetPriceByIdQueryHandler implements IQueryHandler<GetPriceByIdQuery> {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(event: GetPriceByIdQuery): Promise<PriceEntity> {
    return await this.priceRepository
      .findOneOrFail({
        where: {
          id: event.id,
        },
        withDeleted: event.withDeleted,
        relations: ['product'],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error,
            handler: 'GetPriceByIdQueryHandler',
            localisation: 'priceRespository.findOneOrFail',
          }),
        );
        throw new Error('Error while fetching price');
      });
  }
}
