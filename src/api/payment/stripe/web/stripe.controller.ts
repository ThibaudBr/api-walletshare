import { RoleGuard } from '../../../auth/web/guards/role.guard';
import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { StripeService } from '../application/stripe.service';
import { UserRoleEnum } from '../../../user/domain/enum/user-role.enum';
import Stripe from 'stripe';
import { RequestUser } from '../../../auth/domain/interface/request-user.interface';
import { ChargeStripeRequest } from './request/charge-stripe.request';
import { AttachCreditCardRequest } from './request/attach-credit-card.request';
import { SetDefaultCreditCardStripRequest } from './request/set-default-credit-card-strip.request';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/public/charge')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async chargeCustomer(
    @Req() requestUser: RequestUser,
    @Body() chargeStripe: ChargeStripeRequest,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.stripeService.chargeCustomer(requestUser.user.stripeCustomerId, chargeStripe);
  }

  @Post('/public/attach-credit-card')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async attachCreditCard(
    @Req() requestUser: RequestUser,
    @Body() attachCreditCard: AttachCreditCardRequest,
  ): Promise<Stripe.Response<Stripe.SetupIntent>> {
    return await this.stripeService.attachPaymentMethodToCustomer(requestUser.user.stripeCustomerId, attachCreditCard);
  }

  @Get('/public/list-saved-credit-card')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getListSavedCreditCard(@Req() requestUser: RequestUser): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    return await this.stripeService.getListSavedCreditCardOfUser(requestUser.user.stripeCustomerId);
  }

  @Put('/public/set-default-credit-card')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async setDefaultCreditCard(
    @Req() requestUser: RequestUser,
    @Body() setDefaultCreditCard: SetDefaultCreditCardStripRequest,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return await this.stripeService.setDefaultCreditCard(requestUser.user.stripeCustomerId, setDefaultCreditCard);
  }
}
