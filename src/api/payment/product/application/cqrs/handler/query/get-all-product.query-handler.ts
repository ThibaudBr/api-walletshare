import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { GetAllProductQuery } from '../../query/get-all-product.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../../../domain/entities/product.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllProductQuery)
export class GetAllProductQueryHandler implements IQueryHandler<GetAllProductQuery> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllProductQuery): Promise<ProductEntity[]> {
    return await this.productRepository
      .find({
        take: query.limit,
        skip: query.offset,
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'productRepository.find',
            handler: 'GetAllProductQueryHandler',
            error: error.message,
          }),
        );
        throw new Error('Error during the get all products');
      });
  }
}
