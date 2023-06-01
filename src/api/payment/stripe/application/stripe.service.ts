import { ForbiddenException, Injectable } from '@nestjs/common';
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
import { CreateSubscriptionStripeEvent } from './cqrs/event/create-subscription-stripe.event';
import { CreateSubscriptionStripeCommand } from './cqrs/command/create-subscription-stripe.command';
import { GetListSubscriptionStripeQuery } from './cqrs/query/get-list-subscription-stripe.query';
import { ConstructEventFromPayloadStripeCommand } from './cqrs/command/construct-event-from-payload-stripe.command';

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
    stripeCustomerId: string,
    price: string,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    return await this.commandBus
      .execute(
        new CreateSubscriptionStripeCommand({
          stripeCustomerId: stripeCustomerId,
          priceId: price,
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

  public async constructEventFromStripeWebhook(stripeSignature: string, payload: Buffer): Promise<Stripe.Event> {
    return await this.commandBus.execute(
      new ConstructEventFromPayloadStripeCommand({
        payload: payload,
        signature: stripeSignature,
      }),
    );
  }

  private async isUserIdOwnerOfStripeCustomerId(userId: string, stripeCustomerId: string): Promise<boolean> {
    return await this.queryBus.execute(
      new IsUserIdOwnerOfStripeCustomerIdQuery({
        userId: userId,
        stripeCustomerId: stripeCustomerId,
      }),
    );
  }
}
