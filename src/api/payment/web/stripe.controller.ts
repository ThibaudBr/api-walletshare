import { RoleGuard } from '../../auth/web/guards/role.guard';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { StripeService } from '../application/stripe.service';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import Stripe from 'stripe';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';
import { ChargeStripeRequest } from './request/charge-stripe.request';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/public/charge')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async chargeCustomer(
    @Req() requestUser: RequestUser,
    @Body() chargeStripe: ChargeStripeRequest,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.stripeService.chargeCustomer(requestUser.user.id, chargeStripe);
  }
}
