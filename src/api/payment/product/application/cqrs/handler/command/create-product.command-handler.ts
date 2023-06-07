import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '../../command/create-product.command';
import { ProductEntity } from '../../../../domain/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { CreateProductEvent } from '../../event/create-product.event';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const newProductEntity: ProductEntity = new ProductEntity({
      name: command.name,
      description: command.description,
      jsonStripeMetadata: command.jsonStripeMetadata,
      stripeProductId: command.stripeProductId,
      accountStatus: command.userAccountStatus,
    });

    const newProduct: ProductEntity = await this.productRepository.save(newProductEntity).catch(async (error: any) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'productRepository.save',
          handler: 'CreateProductCommandHandler',
          error: error,
        }),
      );
      throw new Error('Error during the creation of the product');
    });

    await this.eventBus.publish(
      new CreateProductEvent({
        productId: newProduct.id,
        stripeProductId: newProduct.stripeProductId,
      }),
    );
  }
}
