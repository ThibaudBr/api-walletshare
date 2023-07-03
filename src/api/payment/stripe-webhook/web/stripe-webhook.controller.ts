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

export const RawBody = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return Buffer.from(request.body, 'utf-8');
});

@Controller('webhook')
@ApiTags('Stripe Webhook')
export class StripeWebhookController {
  constructor(
    private readonly stripService: StripeService,
    private readonly stripeWebhookService: StripeWebhookService,
  ) {}

  @Post('subscription')
  public async subscription(@Headers('stripe-signature') signature: string, @RawBody() rawBody: Buffer): Promise<void> {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    if (!rawBody) {
      throw new BadRequestException('Invalid payload');
    }

    const event = await this.stripService.constructEventFromStripeWebhook(
      signature,
      rawBody,
      StripeWebhookSignatureEnum.SUBSCRIPTION,
    );
    await this.stripeWebhookService.processSubscription(event);
  }
}
