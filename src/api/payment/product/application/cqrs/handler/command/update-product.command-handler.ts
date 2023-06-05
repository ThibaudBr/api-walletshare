import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from '../../command/update-product.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../../../domain/entities/product.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const product: ProductEntity = await this.productRepository
      .findOneOrFail({
        where: {
          id: command.id,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'productRepository.findOneOrFail',
            handler: 'UpdateProductCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Error during the update of the product');
      });

    if (command.stripeProductId) product.stripeProductId = command.stripeProductId;
    if (command.name) product.name = command.name;
    if (command.description) product.description = command.description;
    if (command.jsonStripeMetadata) product.jsonStripeMetadata = command.jsonStripeMetadata;
    if (command.active) product.active = command.active;

    await this.productRepository.save(product).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'productRepository.save',
          handler: 'UpdateProductCommandHandler',
          error: error.message,
        }),
      );
      throw new Error('Error during the update of the product');
    });

    await this.eventBus.publish(
      new UpdateProductCommand({
        id: product.id,
        stripeProductId: product.stripeProductId,
        name: product.name,
        description: product.description,
      }),
    );
  }
}
