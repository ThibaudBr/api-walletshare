import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateStripeCustomerCommand } from './cqrs/command/create-stripe-customer.command';
import { InvalidIdHttpException } from '../../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ChargeStripeCommand } from './cqrs/command/charge-stripe.command';
import { ChargeStripeRequest } from '../web/request/charge-stripe.request';
import { IsUserIdOwnerOfStripeCustomerIdQuery } from './cqrs/query/is-user-id-owner-of-stripe-customer-id.query';
import { AttachCreditCardCommand } from './cqrs/command/attach-credit-card.command';
import { AttachCreditCardRequest } from '../web/request/attach-credit-card.request';
import { GetListSavedCreditCardOfUserQuery } from './cqrs/query/get-list-saved-credit-card-of-user.query';
import { SetDefaultCreditCardStripeCommand } from './cqrs/command/set-default-credit-card-stripe.command';
import { SetDefaultCreditCardStripRequest } from '../web/request/set-default-credit-card-strip.request';
import { CreateSubscriptionStripeCommand } from './cqrs/command/create-subscription-stripe.command';
import { GetListSubscriptionStripeQuery } from './cqrs/query/get-list-subscription-stripe.query';
import { ConstructEventFromPayloadStripeCommand } from './cqrs/command/construct-event-from-payload-stripe.command';
import { CancelSubscriptionStripeCommand } from './cqrs/command/cancel-subscription-stripe.command';
import { CreateProductStripeCommand } from './cqrs/command/create-product-stripe.command';
import { GetProductStripeByIdQuery } from './cqrs/query/get-product-stripe-by-id.query';
import { GetAllProductStripeQuery } from './cqrs/query/get-all-product-stripe.query';
import { UpdateProductStripeCommand } from './cqrs/command/update-product-stripe.command';
import { RemoveProductStripeCommand } from './cqrs/command/remove-product-stripe.command';
import { UpdateProductStripRequest } from '../web/request/update-product-strip.request';
import { GetAllPriceStripeQuery } from './cqrs/query/get-all-price-stripe.query';
import { GetPriceByIdStripeQuery } from './cqrs/query/get-price-by-id-stripe.query';
import { CreatePriceStripeCommand } from './cqrs/command/create-price-stripe.command';
import { CreatePriceStripeRequest } from '../web/request/create-price-stripe.request';
import { UpdatePriceStripeCommand } from './cqrs/command/update-price-stripe.command';
import { UpdatePriceStripeRequest } from '../web/request/update-price-stripe.request';
import { RemovePriceStripeCommand } from './cqrs/command/remove-price-stripe.command';
import { GetSubscriptionStripeQuery } from './cqrs/query/get-subscription-stripe.query';
import { GetAllSubscriptionFromCustomerIdStripeQuery } from './cqrs/query/get-all-subscription-from-customer-id-stripe.query';
import { GetAllInvoiceByCustomerIdStripeQuery } from './cqrs/query/get-all-invoice-by-customer-id-stripe.query';
import { CreateCouponStripeCommand } from './cqrs/command/create-coupon-stripe.command';
import { CreateReferralCodeStripeCommand } from './cqrs/command/create-referral-code-stripe.command';
import { UpdateCouponStripeCommand } from './cqrs/command/update-coupon-stripe.command';
import { DeleteCouponStripeCommand } from './cqrs/command/delete-coupon-stripe.command';
import { UpdateCouponStripeRequest } from '../web/request/update-coupon-stripe.request';
import { CreateReferralCodeStripeRequest } from '../web/request/create-referral-code-stripe.request';
import { CreateCouponStripeRequest } from '../web/request/create-coupon-stripe.request';
import { StripeWebhookSignatureEnum } from '../../stripe-webhook/domain/enum/stripe-webhook-signature.enum';
import { GetInvoiceByStripeIdQuery } from './cqrs/query/get-invoice-by-stripe-id.query';
import { CreateSubscriptionRequest } from '../../subscription/web/request/create-subscription.request';
import * as buffer from 'buffer';

@Injectable()
export class StripeService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async createCustomer(userId: string, name: string, email: string): Promise<void> {
    await this.commandBus
      .execute(
        new CreateStripeCustomerCommand({
          username: name,
          email: email,
          userId: userId,
        }),
      )
      .catch(error => {
        if (error.message === 'User not found') throw new InvalidIdHttpException('User not found');
        throw new Error('Error during the creation of the customer');
      });
  }

  public async chargeCustomer(
    stripCustomerId: string,
    chargeStripeRequest: ChargeStripeRequest,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.commandBus
      .execute(
        new ChargeStripeCommand({
          amount: chargeStripeRequest.amount,
          stripeCustomerId: stripCustomerId,
          paymentMethodId: chargeStripeRequest.paymentMethodId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the charge of the customer')
          throw new InvalidIdHttpException('Error during the charge of the customer');
        throw new Error('Error during the charge of the customer');
      });
  }

  public async attachPaymentMethodToCustomer(
    stripeCustomerId: string,
    attachCreditCardRequest: AttachCreditCardRequest,
  ): Promise<Stripe.Response<Stripe.SetupIntent>> {
    return await this.commandBus
      .execute(
        new AttachCreditCardCommand({
          stripeCustomerId: stripeCustomerId,
          paymentMethodId: attachCreditCardRequest.paymentMethodId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the attachment of the payment method')
          throw new InvalidIdHttpException('Error during the attachment of the payment method');
        throw new Error('Error during the attachment of the payment method');
      });
  }

  public async getListSavedCreditCardOfUser(stripeCustomerId: string): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    return await this.queryBus.execute(
      new GetListSavedCreditCardOfUserQuery({
        stripeCustomerId: stripeCustomerId,
      }),
    );
  }

  public async setDefaultCreditCard(
    stripeCustomerId: string,
    setDefaultCreditCard: SetDefaultCreditCardStripRequest,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return await this.commandBus
      .execute(
        new SetDefaultCreditCardStripeCommand({
          stripeCustomerId: stripeCustomerId,
          paymentMethodId: setDefaultCreditCard.paymentMethodId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the set default credit card')
          throw new InvalidIdHttpException('Error during the set default credit card');
        throw new Error('Error during the set default credit card');
      });
  }

  public async createSubscription(
    createSubscriptionRequest: CreateSubscriptionRequest,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    return await this.commandBus
      .execute(
        new CreateSubscriptionStripeCommand({
          stripeCustomerId: createSubscriptionRequest.customerId,
          priceId: createSubscriptionRequest.priceId,
          promotionCode: createSubscriptionRequest.referralCode,
          paymentMethod: createSubscriptionRequest.paymentMethod,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the subscription creation')
          throw new InvalidIdHttpException('Error during the subscription creation');
        throw new Error('Error during the subscription creation');
      });
  }

  public async getListSubscription(
    stripeCustomerId: string,
    priceId: string,
  ): Promise<Stripe.ApiList<Stripe.Subscription>> {
    return await this.queryBus
      .execute(
        new GetListSubscriptionStripeQuery({
          stripeCustomerId: stripeCustomerId,
          priceId: priceId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error while fetching list of subscription')
          throw new InvalidIdHttpException('Error while fetching list of subscription');
        throw new Error('Error while fetching list of subscription');
      });
  }

  public async constructEventFromStripeWebhook(
    stripeSignature: string,
    payload: Buffer,
    stripeWebhookSignatureEnum: StripeWebhookSignatureEnum,
  ): Promise<Stripe.Event> {
    return await this.commandBus.execute(
      new ConstructEventFromPayloadStripeCommand({
        payload: payload,
        signature: stripeSignature,
        stripeWebhookSignatureEnum: stripeWebhookSignatureEnum,
      }),
    );
  }

  public async cancelSubscription(
    stripeCustomerId: string,
    subscriptionId: string,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    return await this.commandBus
      .execute(
        new CancelSubscriptionStripeCommand({
          stripeCustomerId: stripeCustomerId,
          subscriptionId: subscriptionId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the subscription cancellation')
          throw new InvalidIdHttpException('Error during the subscription cancellation');
        throw new Error('Error during the subscription cancellation');
      });
  }

  public async getAllProducts(limit: number, offset: string): Promise<Stripe.ApiList<Stripe.Product>> {
    return await this.queryBus
      .execute(
        new GetAllProductStripeQuery({
          limit: limit,
          offset: offset,
        }),
      )
      .catch(error => {
        if (error.message === 'Error while fetching list of products')
          throw new InvalidIdHttpException('Error while fetching list of products');
        throw new Error('Error while fetching list of products');
      });
  }

  public async getProductById(productId: string): Promise<Stripe.Product> {
    return await this.queryBus.execute(new GetProductStripeByIdQuery({ id: productId })).catch(error => {
      if (error.message === 'Error while fetching product')
        throw new InvalidIdHttpException('Error while fetching product');
      throw new Error('Error while fetching product');
    });
  }

  public async createProductStripe(name: string, description: string): Promise<Stripe.Product> {
    return await this.commandBus
      .execute(
        new CreateProductStripeCommand({
          name: name,
          description: description,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the creation of the product')
          throw new InvalidIdHttpException('Error during the creation of the product');
        throw new Error('Error during the creation of the product');
      });
  }

  public async updateProductStripe(updateProductStripeRequest: UpdateProductStripRequest): Promise<Stripe.Product> {
    return await this.commandBus
      .execute(
        new UpdateProductStripeCommand({
          productStripeId: updateProductStripeRequest.productStripeId,
          name: updateProductStripeRequest.name,
          description: updateProductStripeRequest.description,
          defaultPriceId: updateProductStripeRequest.defaultPriceId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the update of the product')
          throw new InvalidIdHttpException('Error during the update of the product');
        throw new Error('Error during the update of the product');
      });
  }

  public async removeProductStripe(productStripeId: string): Promise<Stripe.DeletedProduct> {
    return await this.commandBus
      .execute(
        new RemoveProductStripeCommand({
          id: productStripeId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the remove of the product')
          throw new InvalidIdHttpException('Error during the remove of the product');
        throw new Error('Error during the remove of the product');
      });
  }

  public async getAllProductStripe(): Promise<Stripe.Product[]> {
    return await this.queryBus
      .execute(
        new GetAllProductStripeQuery({
          limit: 10,
          offset: '0',
        }),
      )
      .catch(error => {
        if (error.message === 'Error while fetching list of products')
          throw new InvalidIdHttpException('Error while fetching list of products');
        throw new Error('Error while fetching list of products');
      });
  }

  public async getProductStripeById(productStripeId: string): Promise<Stripe.Product> {
    return await this.queryBus
      .execute(
        new GetProductStripeByIdQuery({
          id: productStripeId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error while fetching product')
          throw new InvalidIdHttpException('Error while fetching product');
        throw new Error('Error while fetching product');
      });
  }

  // Prices
  public async getAllPrices(limit: number): Promise<Stripe.ApiList<Stripe.Price>> {
    return await this.queryBus
      .execute(
        new GetAllPriceStripeQuery({
          limit: limit,
        }),
      )
      .catch(error => {
        if (error.message === 'Error while fetching list of prices')
          throw new InvalidIdHttpException('Error while fetching list of prices');
        throw new Error('Error while fetching list of prices');
      });
  }

  public async getPriceById(priceId: string): Promise<Stripe.Price> {
    return await this.queryBus
      .execute(
        new GetPriceByIdStripeQuery({
          priceStripeId: priceId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error while fetching price')
          throw new InvalidIdHttpException('Error while fetching price');
        throw new Error('Error while fetching price');
      });
  }

  public async createPriceStripe(createPriceStripeRequest: CreatePriceStripeRequest): Promise<Stripe.Price> {
    return await this.commandBus
      .execute(
        new CreatePriceStripeCommand({
          productId: createPriceStripeRequest.productId,
          unitAmount: createPriceStripeRequest.unitAmount,
          interval: createPriceStripeRequest.interval,
          usageType: createPriceStripeRequest.usageType,
          productStripeId: createPriceStripeRequest.productStripeId,
          active: createPriceStripeRequest.active,
          trialPeriodDays: createPriceStripeRequest.trialPeriodDays,
          intervalCount: createPriceStripeRequest.intervalCount,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the creation of the price')
          throw new InvalidIdHttpException('Error during the creation of the price');
        throw new Error('Error during the creation of the price');
      });
  }

  public async updatePriceStripe(updatePriceStripeRequest: UpdatePriceStripeRequest): Promise<Stripe.Price> {
    return await this.commandBus
      .execute(
        new UpdatePriceStripeCommand({
          priceStripeId: updatePriceStripeRequest.priceStripeId,
          active: updatePriceStripeRequest.active,
          priceId: updatePriceStripeRequest.priceId,
          productId: updatePriceStripeRequest.productId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the update of the price')
          throw new InvalidIdHttpException('Error during the update of the price');
        throw new Error('Error during the update of the price');
      });
  }

  public async removePriceStripe(priceStripeId: string): Promise<Stripe.DeletedPrice> {
    return await this.commandBus
      .execute(
        new RemovePriceStripeCommand({
          priceStripeId: priceStripeId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the remove of the price')
          throw new InvalidIdHttpException('Error during the remove of the price');
        throw new Error('Error during the remove of the price');
      });
  }

  async isUserIdOwnerOfStripeCustomerId(userId: string, stripeCustomerId: string): Promise<boolean> {
    return await this.queryBus.execute(
      new IsUserIdOwnerOfStripeCustomerIdQuery({
        userId: userId,
        stripeCustomerId: stripeCustomerId,
      }),
    );
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Response<Stripe.Subscription>> {
    return await this.queryBus
      .execute(
        new GetSubscriptionStripeQuery({
          subscriptionId: subscriptionId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error while fetching subscription')
          throw new InvalidIdHttpException('Error while fetching subscription');
        throw new InternalServerErrorException('Error while fetching subscription');
      });
  }

  async getAllSubscriptionsFromCustomerId(customerId: string): Promise<Stripe.ApiList<Stripe.Subscription>> {
    return await this.queryBus
      .execute(
        new GetAllSubscriptionFromCustomerIdStripeQuery({
          customerId: customerId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error while fetching subscriptions')
          throw new InvalidIdHttpException('Error while fetching subscriptions');
        throw new InternalServerErrorException('Error while fetching subscriptions');
      });
  }

  async getAllInvoiceByCustomerId(customerId: string): Promise<Stripe.ApiList<Stripe.Invoice>> {
    return await this.queryBus
      .execute(
        new GetAllInvoiceByCustomerIdStripeQuery({
          customerId: customerId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error while fetching invoices')
          throw new InvalidIdHttpException('Error while fetching invoices');
        throw new InternalServerErrorException('Error while fetching invoices');
      });
  }

  async createCouponStripe(
    createCouponStripeRequest: CreateCouponStripeRequest,
  ): Promise<Stripe.Response<Stripe.Coupon>> {
    return await this.commandBus
      .execute(
        new CreateCouponStripeCommand({
          productStripeIdList: createCouponStripeRequest.productStripeIdList,
          percentOff: createCouponStripeRequest.percentOff,
          duration: createCouponStripeRequest.duration,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the creation of the coupon')
          throw new InvalidIdHttpException('Error during the creation of the coupon');
        throw new InternalServerErrorException('Error during the creation of the coupon');
      });
  }

  async createReferralCodeStripe(
    createReferralCodeStripeRequest: CreateReferralCodeStripeRequest,
  ): Promise<Stripe.Coupon> {
    return await this.commandBus
      .execute(
        new CreateReferralCodeStripeCommand({
          customerStripeId: createReferralCodeStripeRequest.customerStripeId,
          couponStripeId: createReferralCodeStripeRequest.couponStripeId,
          code: createReferralCodeStripeRequest.code,
          userId: createReferralCodeStripeRequest.userId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the creation of the coupon')
          throw new InvalidIdHttpException('Error during the creation of the coupon');
        throw new InternalServerErrorException('Error during the creation of the coupon');
      });
  }

  async deleteCouponStripe(couponStripeId: string): Promise<Stripe.Response<Stripe.DeletedCoupon>> {
    return await this.commandBus
      .execute(
        new DeleteCouponStripeCommand({
          couponId: couponStripeId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the remove of the coupon')
          throw new InvalidIdHttpException('Error during the remove of the coupon');
        throw new InternalServerErrorException('Error during the remove of the coupon');
      });
  }

  async updateCouponStripe(
    couponId: string,
    updateCouponStripeRequest: UpdateCouponStripeRequest,
  ): Promise<Stripe.Response<Stripe.Coupon>> {
    return await this.commandBus
      .execute(
        new UpdateCouponStripeCommand({
          couponId: couponId,
          percentOff: updateCouponStripeRequest.percentOff,
          duration: updateCouponStripeRequest.duration,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the update of the coupon')
          throw new InvalidIdHttpException('Error during the update of the coupon');
        throw new InternalServerErrorException('Error during the update of the coupon');
      });
  }

  async getInvoiceByStripeId(stripeInvoiceId: string): Promise<Stripe.Invoice> {
    return await this.queryBus
      .execute(
        new GetInvoiceByStripeIdQuery({
          stripeInvoiceId: stripeInvoiceId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error while fetching invoice')
          throw new InvalidIdHttpException('Error while fetching invoice');
        throw new InternalServerErrorException('Error while fetching invoice from stripe');
      });
  }
}
