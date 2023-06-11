import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { StripeService } from '../../stripe/application/stripe.service';
import { CreatePriceStripeRequest } from '../../stripe/web/request/create-price-stripe.request';
import { CreatePriceCommand } from './cqrs/command/create-price.command';
import Stripe from 'stripe';
import { GetPriceByIdQuery } from './cqrs/query/get-price-by-id.query';
import { RemovePriceCommand } from './cqrs/command/remove-price.command';
import { PriceEntity } from '../domain/entities/price.entity';
import { RestorePriceCommand } from './cqrs/command/restore-price.command';
import { PriceResponse } from '../web/response/price.response';
import { UpdatePriceStripeRequest } from '../../stripe/web/request/update-price-stripe.request';
import { UpdatePriceCommand } from './cqrs/command/update-price.command';
import { GetAllPriceQuery } from './cqrs/query/get-all-price.query';
import { GetAllPriceByProductIdQuery } from './cqrs/query/get-all-price-by-product-id.query';

@Injectable()
export class PriceService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly stripeService: StripeService,
  ) {}

  public async createPrice(createPriceRequest: CreatePriceStripeRequest): Promise<void> {
    const stripePrice: Stripe.Price = await this.stripeService.createPriceStripe(createPriceRequest);

    await this.commandBus
      .execute(
        new CreatePriceCommand({
          ...createPriceRequest,
          priceStripeId: stripePrice.id,
          type: stripePrice.type,
          unitAmountDecimal: stripePrice.unit_amount_decimal ?? undefined,
        }),
      )
      .catch(async error => {
        await this.stripeService.removePriceStripe(stripePrice.id);
        if (error.message === 'Error during find product entity') throw new BadRequestException(error.message);
        if (error.message === 'Error during save price entity') throw new BadRequestException(error.message);
        if (error.message === 'Error during find product entity') throw new BadRequestException(error.message);
        throw error;
      });
  }

  public async removePrice(priceId: string): Promise<void> {
    const priceEntity = await this.queryBus
      .execute(
        new GetPriceByIdQuery({
          id: priceId,
        }),
      )
      .catch(error => {
        if (error.message === 'Price not found') throw new BadRequestException(error.message);
        throw error;
      });

    await this.stripeService.removePriceStripe(priceEntity.priceStripeId);

    await this.commandBus
      .execute(
        new RemovePriceCommand({
          priceId: priceEntity.id,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during remove price entity') throw new BadRequestException(error.message);
        throw error;
      });
  }

  public async softRemovePrice(priceId: string): Promise<void> {
    const priceEntity: PriceEntity = await this.queryBus
      .execute(
        new GetPriceByIdQuery({
          id: priceId,
        }),
      )
      .catch(error => {
        if (error.message === 'Price not found') throw new BadRequestException(error.message);
        throw error;
      });

    await this.stripeService.updatePriceStripe({
      priceStripeId: priceEntity.stripePriceId,
      priceId: priceEntity.id,
      active: false,
      productId: priceEntity.product.id,
    });
  }

  public async restorePrice(priceId: string): Promise<void> {
    const priceEntity: PriceEntity = await this.queryBus
      .execute(
        new GetPriceByIdQuery({
          id: priceId,
          withDeleted: true,
        }),
      )
      .catch(error => {
        if (error.message === 'Price not found') throw new BadRequestException(error.message);
        throw error;
      });

    await this.stripeService.updatePriceStripe({
      priceStripeId: priceEntity.stripePriceId,
      priceId: priceEntity.id,
      active: true,
      productId: priceEntity.product.id,
    });

    await this.commandBus
      .execute(
        new RestorePriceCommand({
          priceId: priceEntity.id,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during restore price entity') throw new BadRequestException(error.message);
        throw error;
      });
  }

  public async getPriceById(priceId: string): Promise<PriceResponse> {
    return await this.queryBus
      .execute(
        new GetPriceByIdQuery({
          id: priceId,
        }),
      )
      .catch(error => {
        if (error.message === 'Price not found') throw new BadRequestException(error.message);
        throw error;
      });
  }

  public async getPriceByIdWithDeleted(priceId: string): Promise<PriceResponse> {
    return await this.queryBus
      .execute(
        new GetPriceByIdQuery({
          id: priceId,
          withDeleted: true,
        }),
      )
      .catch(error => {
        if (error.message === 'Price not found') throw new BadRequestException(error.message);
        throw error;
      });
  }

  public async updatePrice(updatePriceRequest: UpdatePriceStripeRequest): Promise<void> {
    const priceEntity: PriceEntity = await this.queryBus
      .execute(
        new GetPriceByIdQuery({
          id: updatePriceRequest.priceId,
        }),
      )
      .catch(error => {
        if (error.message === 'Price not found') throw new BadRequestException(error.message);
        throw error;
      });

    const stripePrice: Stripe.Price = await this.stripeService.updatePriceStripe({
      priceStripeId: priceEntity.stripePriceId,
      priceId: priceEntity.id,
      active: updatePriceRequest.active,
      productId: priceEntity.product.id,
    });

    await this.commandBus
      .execute(
        new UpdatePriceCommand({
          ...updatePriceRequest,
          stripePriceId: stripePrice.id,
        }),
      )
      .catch(async error => {
        if (error.message === 'Error during update price entity') throw new BadRequestException(error.message);
        if (error.message === 'Error during find price entity') throw new BadRequestException(error.message);
        if (error.message === 'Error during update price entity') throw new BadRequestException(error.message);
        throw error;
      });
  }

  public async getAllPrices(): Promise<PriceResponse[]> {
    return await this.queryBus
      .execute(new GetAllPriceQuery())
      .catch(error => {
        if (error.message === 'Error while fetching prices') throw new BadRequestException(error.message);
        throw error;
      })
      .then((prices: PriceEntity[]) => {
        return prices.map((price: PriceEntity) => {
          return new PriceResponse({
            ...price,
            unitAmountDecimal: Number(price.unitAmountDecimal),
          });
        });
      });
  }

  public async getAllPriceByProductId(productId: string): Promise<PriceResponse[]> {
    return await this.queryBus
      .execute(
        new GetAllPriceByProductIdQuery({
          productId: productId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error while fetching prices') throw new BadRequestException(error.message);
        throw error;
      })
      .then((prices: PriceEntity[]) => {
        return prices.map((price: PriceEntity) => {
          return new PriceResponse({
            ...price,
            unitAmountDecimal: Number(price.unitAmountDecimal),
          });
        });
      });
  }
}
