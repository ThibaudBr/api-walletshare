import { ForbiddenException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateStripeCustomerCommand } from './cqrs/command/create-stripe-customer.command';
import { InvalidIdHttpException } from '../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ChargeStripeCommand } from './cqrs/command/charge-stripe.command';
import { ChargeStripeRequest } from '../web/request/charge-stripe.request';
import { IsUserIdOwnerOfStripeCustomerIdQuery } from './cqrs/query/is-user-id-owner-of-stripe-customer-id.query';

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
    userId: string,
    chargeStripeRequest: ChargeStripeRequest,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    if (!(await this.isUserIdOwnerOfStripeCustomerId(userId, chargeStripeRequest.stripeCustomerId)))
      throw new ForbiddenException('You are not the owner of this stripe customer');

    return await this.commandBus
      .execute(
        new ChargeStripeCommand({
          amount: chargeStripeRequest.amount,
          stripeCustomerId: chargeStripeRequest.stripeCustomerId,
          paymentMethodId: chargeStripeRequest.paymentMethodId,
        }),
      )
      .catch(error => {
        if (error.message === 'Error during the charge of the customer')
          throw new InvalidIdHttpException('Error during the charge of the customer');
        throw new Error('Error during the charge of the customer');
      });
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
