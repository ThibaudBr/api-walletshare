import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreatePriceCommand } from '../../command/create-price.command';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceEntity } from '../../../../domain/entities/price.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../../../../product/domain/entities/product.entity';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { ConfigService } from '@nestjs/config';
import { CreatePriceStripeEvent } from '../../../../../stripe/application/cqrs/event/create-price-stripe.event';

@CommandHandler(CreatePriceCommand)
export class CreatePriceCommandHandler implements ICommandHandler<CreatePriceCommand> {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly eventBus: EventBus,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: CreatePriceCommand): Promise<void> {
    const productEntity: ProductEntity = await this.productRepository
      .findOneOrFail({
        where: {
          id: command.productId,
        },
        relations: ['prices'],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error,
            handler: 'CreatePriceCommandHandler',
            localisation: 'productRepository.findOneOrFail',
          }),
        );
        throw new Error('Error during find product entity');
      });

    const newPriceEntity: PriceEntity = new PriceEntity({
      currency: this.configService.get('STRIPE_CURRENCY'),
      product: productEntity,
      active: command.active,
      stripePriceId: command.priceStripeId,
      interval: command.interval,
      intervalCount: command.intervalCount,
      jsonStripeMetadata: command.jsonStripeMetadata,
      unitAmount: command.unitAmount,
      unitAmountDecimal: command.unitAmountDecimal,
    });

    const savedPrice: PriceEntity = await this.priceRepository.save(newPriceEntity).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error,
          handler: 'CreatePriceCommandHandler',
          localisation: 'priceRepository.save',
        }),
      );
      throw new Error('Error during save price entity');
    });

    productEntity.prices.push(savedPrice);
    await this.productRepository.save(productEntity).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error,
          handler: 'CreatePriceCommandHandler',
          localisation: 'productRepository.save',
        }),
      );
      throw new Error('Error during save product entity');
    });

    await this.eventBus.publish(
      new CreatePriceStripeEvent({
        priceStripeId: command.priceStripeId,
        productId: savedPrice.id,
      }),
    );
  }
}
