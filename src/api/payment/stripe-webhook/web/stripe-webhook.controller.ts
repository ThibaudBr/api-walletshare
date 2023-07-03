import { StripeService } from '../../stripe/application/stripe.service';
import {
  BadRequestException,
  Controller,
  createParamDecorator,
  ExecutionContext,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StripeWebhookService } from '../application/stripe-webhook.service';
import { StripeWebhookSignatureEnum } from '../domain/enum/stripe-webhook-signature.enum';

@Controller('webhook')
@ApiTags('Stripe Webhook')
export class StripeWebhookController {
  constructor(
    private readonly stripService: StripeService,
    private readonly stripeWebhookService: StripeWebhookService,
  ) {}

  @Post('subscription')
  public async subscription(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ): Promise<void> {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    console.log('req.rawBody', req.rawBody);
    console.log(req);
    if (!req.rawBody) {
      throw new BadRequestException('Invalid payload');
    }

    const event = await this.stripService.constructEventFromStripeWebhook(
      signature,
      req.rawBody,
      StripeWebhookSignatureEnum.SUBSCRIPTION,
    );
    await this.stripeWebhookService.processSubscription(event);
  }
}
