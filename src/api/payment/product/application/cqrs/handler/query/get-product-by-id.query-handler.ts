import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductByIdQuery } from '../../query/get-product-by-id.query';
import { ProductEntity } from '../../../../domain/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdQueryHandler implements IQueryHandler<GetProductByIdQuery> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<ProductEntity> {
    return await this.productRepository
      .findOneOrFail({
        relations: ['prices'],
        where: {
          id: query.id,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'productRepository.findOneOrFail',
            handler: 'GetProductByIdQueryHandler',
            error: error.message,
          }),
        );
        throw new Error('Error during the get product by id');
      });
  }
}
