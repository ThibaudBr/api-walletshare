import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AttachCreditCardCommand } from '../../command/attach-credit-card.command';
import Stripe from 'stripe';
import { AttachCreditCardEvent } from '../../event/attach-credit-card.event';
import { ConfigService } from '@nestjs/config';

@CommandHandler(AttachCreditCardCommand)
export class AttachCreditCardCommandHandler implements ICommandHandler<AttachCreditCardCommand> {
  private stripe: Stripe;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') == 'prod') {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_PROD') ?? 'error', {
        apiVersion: '2022-11-15',
      });
    } else {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST') ?? 'error', {
        apiVersion: '2022-11-15',
      });
    }
  }

  async execute(command: AttachCreditCardCommand): Promise<Stripe.Response<Stripe.SetupIntent>> {
    const setupIntents: Stripe.Response<Stripe.SetupIntent> = await this.stripe.setupIntents.create({
      customer: command.stripeCustomerId,
      payment_method: command.paymentMethodId,
    });

    await this.eventBus.publish(
      new AttachCreditCardEvent({
        paymentMethodId: command.paymentMethodId,
        stripeCustomerId: command.stripeCustomerId,
      }),
    );

    return setupIntents;
  }
}
