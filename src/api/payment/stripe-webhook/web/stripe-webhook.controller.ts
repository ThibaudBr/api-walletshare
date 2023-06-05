import { StripeService } from '../../stripe/application/stripe.service';
import { BadRequestException, Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StripeWebhookService } from '../application/stripe-webhook.service';

@Controller('webhook')
@ApiTags('Stripe Webhook')
export class StripeWebhookController {
  constructor(
    private readonly stripService: StripeService,
    private readonly stripeWebhookService: StripeWebhookService,
  ) {}

  @Post('stripe')
  public async stripe(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<void> {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    if (!req.rawBody) {
      throw new BadRequestException('Invalid payload');
    }
    const event = await this.stripService.constructEventFromStripeWebhook(signature, req.rawBody);
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
      return this.stripeWebhookService.processSubscriptionUpdate(event);
    }
  }
}
