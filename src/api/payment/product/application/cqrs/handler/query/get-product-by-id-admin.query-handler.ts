import {EventBus, IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetProductByIdAdminQuery} from "../../query/get-product-by-id-admin.query";
import {ErrorCustomEvent} from "../../../../../../../util/exception/error-handler/error-custom.event";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "../../../../domain/entities/product.entity";
import {Repository} from "typeorm";

@QueryHandler(GetProductByIdAdminQuery)
export class GetProductByIdAdminQueryHandler implements IQueryHandler<GetProductByIdAdminQuery> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly eventBus: EventBus,
  ) {
  }

  async execute(query: GetProductByIdAdminQuery): Promise<ProductEntity> {
    return await this.productRepository
      .findOneOrFail({
        withDeleted: true,
        relations: ['prices'],
        where: {
          id: query.id,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'productRepository.findOneOrFail',
            handler: 'GetProductByIdAdminQueryHandler',
            error: error.message,
          }),
        );
        throw new Error('Error during the get product by id');
      });
  }
}
