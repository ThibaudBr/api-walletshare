import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftRemoveProductEvent } from '../../event/soft-remove-product.event';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../../../domain/entities/product.entity';
import { Repository } from 'typeorm';

@CommandHandler(SoftRemoveProductEvent)
export class SoftRemoveProductCommandHandler implements ICommandHandler<SoftRemoveProductEvent> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftRemoveProductEvent): Promise<void> {
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
            handler: 'SoftRemoveProductCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Error during the soft remove of the product');
      });

    await this.productRepository.softRemove(product).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'productRepository.softRemove',
          handler: 'SoftRemoveProductCommandHandler',
          error: error.message,
        }),
      );
      throw new Error('Error during the soft remove of the product');
    });

    await this.eventBus.publish(
      new SoftRemoveProductEvent({
        id: product.id,
      }),
    );
  }
}
