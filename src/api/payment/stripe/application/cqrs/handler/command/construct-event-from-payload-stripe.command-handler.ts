import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ConstructEventFromPayloadStripeCommand } from '../../command/construct-event-from-payload-stripe.command';
import Stripe from 'stripe';
import { ConstructEventFromPayloadStripeEvent } from '../../event/construct-event-from-payload-stripe.event';

@CommandHandler(ConstructEventFromPayloadStripeCommand)
export class ConstructEventFromPayloadStripeCommandHandler
  implements ICommandHandler<ConstructEventFromPayloadStripeCommand>
{
  private stripe: Stripe;
  private stripWebHookSecret: string;

  constructor(private readonly eventBus: EventBus) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'error', {
      apiVersion: '2022-11-15',
    });
    this.stripWebHookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'error';
  }

  async execute(command: ConstructEventFromPayloadStripeCommand): Promise<Stripe.Event> {
    const event: Stripe.Event = await this.stripe.webhooks.constructEvent(
      command.payload,
      command.signature,
      this.stripWebHookSecret,
    );

    await this.eventBus.publish(
      new ConstructEventFromPayloadStripeEvent({
        signature: command.signature,
      }),
    );

    return event;
  }
}
