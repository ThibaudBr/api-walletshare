import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ConstructEventFromPayloadStripeCommand } from '../../command/construct-event-from-payload-stripe.command';
import Stripe from 'stripe';
import { ConstructEventFromPayloadStripeEvent } from '../../event/construct-event-from-payload-stripe.event';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(ConstructEventFromPayloadStripeCommand)
export class ConstructEventFromPayloadStripeCommandHandler
  implements ICommandHandler<ConstructEventFromPayloadStripeCommand>
{
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

  async execute(command: ConstructEventFromPayloadStripeCommand): Promise<Stripe.Event> {
    try {
      const event: Stripe.Event = this.stripe.webhooks.constructEvent(
        command.payload,
        command.signature,
        this.configService.get(command.stripeWebhookSignatureEnum) ?? 'err',
      );

      await this.eventBus.publish(
        new ConstructEventFromPayloadStripeEvent({
          signature: command.signature,
        }),
      );
      return event;
    } catch (error) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'ConstructEventFromPayloadStripeCommand',
          localisation: 'stripe.webhooks.constructEvent',
          error: error.message,
        }),
      );
      throw new BadRequestException('Error while validating stripe signature');
    }
  }
}
