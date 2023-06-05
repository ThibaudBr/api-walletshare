import { EventBus, ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllProductAdminQuery } from '../../query/get-all-product-admin.query';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../../../domain/entities/product.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllProductAdminQuery)
export class GetAllProductAdminQueryHandler implements ICommandHandler<GetAllProductAdminQuery> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllProductAdminQuery): Promise<ProductEntity[]> {
    return await this.productRepository
      .find({
        withDeleted: true,
        take: query.limit,
        skip: query.offset,
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'productRepository.find',
            handler: 'GetAllProductAdminQueryHandler',
            error: error.message,
          }),
        );
        throw new Error('Error during the get all products');
      });
  }
}
