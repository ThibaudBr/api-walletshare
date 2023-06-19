import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { ProductEntity } from '../../../product/domain/entities/product.entity';
import { PriceEntity } from '../../domain/entities/price.entity';

@EventSubscriber()
export class ProductPriceSubscriber implements EntitySubscriberInterface<ProductEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return ProductEntity;
  }

  async beforeRemove(event: RemoveEvent<ProductEntity>): Promise<void> {
    const removedProduct: ProductEntity | undefined = event.entity;
    const priceRepository = event.manager.getRepository(PriceEntity);
    const prices: PriceEntity[] = await priceRepository.find({
      relations: ['product'],
      withDeleted: true,
      where: {
        product: {
          id: removedProduct?.id,
        },
      },
    });
    if (prices.length == 0) return;
    for (const price of prices) {
      await priceRepository.remove(price);
    }
  }

  async beforeSoftRemove(event: SoftRemoveEvent<ProductEntity>): Promise<void> {
    const softRemovedProduct: ProductEntity | undefined = event.entity;
    const priceRepository = event.manager.getRepository(PriceEntity);
    const prices: PriceEntity[] = await priceRepository.find({
      relations: ['product'],
      where: {
        product: {
          id: softRemovedProduct?.id,
        },
      },
    });
    if (prices.length == 0) return;
    for (const price of prices) {
      await priceRepository.softRemove(price);
    }
  }
}
