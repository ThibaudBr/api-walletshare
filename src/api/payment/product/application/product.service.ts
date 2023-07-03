import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { StripeService } from '../../stripe/application/stripe.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './cqrs/command/create-product.command';
import { InvalidIdHttpException } from '../../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { CreateProductRequest } from '../web/request/create-product.request';
import { GetProductByIdAdminQuery } from './cqrs/query/get-product-by-id-admin.query';
import { RemoveProductCommand } from './cqrs/command/remove-product.command';
import { ProductEntity } from '../domain/entities/product.entity';
import { SoftRemoveProductCommand } from './cqrs/command/soft-remove-product.command';
import { RestoreProductCommand } from './cqrs/command/restore-product.command';
import { UpdateProductCommand } from './cqrs/command/update-product.command';
import { UpdateProductRequest } from '../web/request/update-product.request';
import Stripe from 'stripe';
import { ProductResponse } from '../web/response/product.response';
import { GetAllProductQuery } from './cqrs/query/get-all-product.query';
import { GetAllProductAdminQuery } from './cqrs/query/get-all-product-admin.query';
import { GetProductByIdQuery } from './cqrs/query/get-product-by-id.query';
import { PriceResponse } from '../../price/web/response/price.response';

@Injectable()
export class ProductService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly stripeService: StripeService,
  ) {}

  public async createProduct(createProductRequest: CreateProductRequest): Promise<void> {
    const stripProduct = await this.stripeService.createProductStripe(
      createProductRequest.name,
      createProductRequest.description,
    );

    await this.commandBus
      .execute(
        new CreateProductCommand({
          name: createProductRequest.name,
          description: createProductRequest.description,
          stripeProductId: stripProduct.id,
          jsonStripeMetadata: stripProduct,
          userAccountStatus: createProductRequest.userAccountStatus,
          userRoleToGive: createProductRequest.userRoleToGive,
          profileRoleToGive: createProductRequest.profileRoleToGive,
        }),
      )
      .catch(async error => {
        await this.stripeService.removeProductStripe(stripProduct.id);
        if (error.message === 'Error during the creation of the product')
          throw new InvalidIdHttpException('Error during the creation of the product');
        throw new InternalServerErrorException('Error during the creation of the product');
      });
  }

  public async removeProduct(productId: string): Promise<void> {
    const productEntity = await this.queryBus
      .execute(
        new GetProductByIdAdminQuery({
          id: productId,
        }),
      )
      .catch(error => {
        if (error.message === 'Product not found') throw new InvalidIdHttpException('Product not found');
        throw new InternalServerErrorException('Error during the remove of the product');
      });

    await this.stripeService.removeProductStripe(productEntity.stripeProductId);

    await this.commandBus
      .execute(
        new RemoveProductCommand({
          id: productId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the remove of the product')
          throw new InvalidIdHttpException('Error during the remove of the product');
        throw new InternalServerErrorException('Error during the remove of the product');
      });
  }

  public async softRemoveProduct(productId: string): Promise<void> {
    const productEntity: ProductEntity = await this.queryBus
      .execute(
        new GetProductByIdAdminQuery({
          id: productId,
        }),
      )
      .catch(error => {
        if (error.message === 'Product not found') throw new InvalidIdHttpException('Product not found');
        throw new InternalServerErrorException('Error during the remove of the product');
      });

    await this.stripeService.updateProductStripe({
      productStripeId: productEntity.stripeProductId,
      active: false,
    });

    await this.commandBus
      .execute(
        new SoftRemoveProductCommand({
          id: productId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the remove of the product')
          throw new InvalidIdHttpException('Error during the remove of the product');
        throw new InternalServerErrorException('Error during the remove of the product');
      });
  }

  public async restoreProduct(productId: string): Promise<void> {
    const productEntity: ProductEntity = await this.queryBus
      .execute(
        new GetProductByIdAdminQuery({
          id: productId,
        }),
      )
      .catch(error => {
        if (error.message === 'Product not found') throw new InvalidIdHttpException('Product not found');
        throw new InternalServerErrorException('Error during the restore of the product');
      });

    await this.stripeService.updateProductStripe({
      productStripeId: productEntity.stripeProductId,
      active: true,
    });

    await this.commandBus
      .execute(
        new RestoreProductCommand({
          id: productId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the restore of the product')
          throw new InvalidIdHttpException('Error during the restore of the product');
        throw new InternalServerErrorException('Error during the restore of the product');
      });
  }

  public async updateProduct(updateProductRequest: UpdateProductRequest): Promise<void> {
    const productEntity: ProductEntity = await this.queryBus
      .execute(
        new GetProductByIdAdminQuery({
          id: updateProductRequest.id,
        }),
      )
      .catch(error => {
        if (error.message === 'Product not found') throw new InvalidIdHttpException('Product not found');
        throw new InternalServerErrorException('Error during the update of the product');
      });

    const productStripe: Stripe.Product = await this.stripeService.updateProductStripe({
      productStripeId: productEntity.stripeProductId,
      name: updateProductRequest.name,
      description: updateProductRequest.description,
      active: updateProductRequest.active,
    });

    await this.commandBus
      .execute(
        new UpdateProductCommand({
          id: updateProductRequest.id,
          name: updateProductRequest.name,
          description: updateProductRequest.description,
          stripeProductId: updateProductRequest.stripeProductId,
          active: updateProductRequest.active,
          jsonStripeMetadata: productStripe,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the update of the product')
          throw new InvalidIdHttpException('Error during the update of the product');
        throw new InternalServerErrorException('Error during the update of the product');
      });
  }

  public async getProductByIdAdmin(productId: string): Promise<ProductResponse> {
    return await this.queryBus
      .execute(
        new GetProductByIdAdminQuery({
          id: productId,
        }),
      )
      .catch(error => {
        if (error.message === 'Product not found') throw new InvalidIdHttpException('Product not found');
        throw new InternalServerErrorException('Error during the get of the product');
      })
      .then(productEntity => {
        return new ProductResponse({
          ...productEntity,
        });
      });
  }

  public async getProductById(productId: string): Promise<ProductResponse> {
    return await this.queryBus
      .execute(
        new GetProductByIdQuery({
          id: productId,
        }),
      )
      .catch(error => {
        if (error.message === 'Product not found') throw new InvalidIdHttpException('Product not found');
        throw new InternalServerErrorException('Error during the get of the product');
      })
      .then(productEntity => {
        return new ProductResponse({
          ...productEntity,
        });
      });
  }

  public async getProducts(limit = 10, offset = 0): Promise<ProductResponse[]> {
    return await this.queryBus
      .execute(
        new GetAllProductQuery({
          limit: limit,
          offset: offset,
        }),
      )
      .catch(error => {
        if (error.message === 'Product not found') throw new InvalidIdHttpException('Product not found');
        throw new InternalServerErrorException('Error during the get of the product');
      })
      .then((productEntities: ProductEntity[]) => {
        return productEntities.map(
          productEntity =>
            new ProductResponse({
              ...productEntity,
              prices: productEntity.prices.map(
                priceEntity =>
                  new PriceResponse({
                    ...priceEntity,
                    unitAmountDecimal: Number(priceEntity.unitAmountDecimal),
                  }),
              ),
            }),
        );
      });
  }

  public async getProductsAdmin(limit = 10, offset = 0): Promise<ProductResponse[]> {
    return await this.queryBus
      .execute(
        new GetAllProductAdminQuery({
          limit: limit,
          offset: offset,
        }),
      )
      .catch(error => {
        if (error.message === 'Product not found') throw new InvalidIdHttpException('Product not found');
        throw new InternalServerErrorException('Error during the get of the product');
      })
      .then((productEntities: ProductEntity[]) => {
        return productEntities.map(
          productEntity =>
            new ProductResponse({
              ...productEntity,
              prices: productEntity.prices
                ? productEntity.prices.map(
                    priceEntity =>
                      new PriceResponse({
                        ...priceEntity,
                        unitAmountDecimal: Number(priceEntity.unitAmountDecimal),
                      }),
                  )
                : undefined,
            }),
        );
      });
  }
}
