import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProductCommand } from '../../command/remove-product.command';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../../../domain/entities/product.entity';
import { Repository } from 'typeorm';
import { RemoveProductEvent } from '../../event/remove-product.event';

@CommandHandler(RemoveProductCommand)
export class RemoveProductCommandHandler implements ICommandHandler<RemoveProductCommand> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveProductCommand): Promise<void> {
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
            handler: 'RemoveProductCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Error during the removal of the product');
      });

    await this.productRepository.remove(product).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'productRepository.remove',
          handler: 'RemoveProductCommandHandler',
          error: error.message,
        }),
      );
      throw new Error('Error during the soft remove of the product');
    });

    await this.eventBus.publish(
      new RemoveProductEvent({
        id: product.id,
      }),
    );
  }
}
