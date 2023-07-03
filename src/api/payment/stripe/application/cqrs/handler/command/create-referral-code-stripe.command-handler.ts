import { CreateReferralCodeStripeCommand } from '../../command/create-referral-code-stripe.command';
import Stripe from 'stripe';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(CreateReferralCodeStripeCommand)
export class CreateReferralCodeStripeCommandHandler implements ICommandHandler<CreateReferralCodeStripeCommand> {
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

  async execute(command: CreateReferralCodeStripeCommand): Promise<Stripe.Response<Stripe.PromotionCode>> {
    return await this.stripe.promotionCodes
      .create({
        coupon: command.couponStripeId,
        code: command.code,
        metadata: {
          userId: command.userId,
        },
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'payment',
            handler: 'CreateReferralCodeStripeCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Error during the creation of the referral code');
      })
      .then(async referralCode => {
        await this.eventBus.publish(
          new CreateReferralCodeStripeCommand({
            couponStripeId: command.couponStripeId,
            customerStripeId: command.customerStripeId,
          }),
        );
        return referralCode;
      });
  }
}
