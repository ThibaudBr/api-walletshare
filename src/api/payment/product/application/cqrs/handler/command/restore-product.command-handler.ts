import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RestoreProductCommand } from '../../command/restore-product.command';
import { RestoreProductEvent } from '../../event/restore-product.event';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../../../domain/entities/product.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RestoreProductCommand)
export class RestoreProductCommandHandler implements ICommandHandler<RestoreProductCommand> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreProductCommand): Promise<void> {
    const product: ProductEntity = await this.productRepository
      .findOneOrFail({
        where: {
          id: command.id,
        },
        withDeleted: true,
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'productRepository.findOneOrFail',
            handler: 'RestoreProductCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Error during the restore of the product');
      });

    await this.productRepository.restore(product.id).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'productRepository.restore',
          handler: 'RestoreProductCommandHandler',
          error: error.message,
        }),
      );
      throw new Error('Error during the restore of the product');
    });

    await this.eventBus.publish(
      new RestoreProductEvent({
        id: command.id,
      }),
    );
  }
}
