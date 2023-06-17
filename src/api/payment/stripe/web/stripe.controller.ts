import { RoleGuard } from '../../../auth/web/guards/role.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { StripeService } from '../application/stripe.service';
import { UserRoleEnum } from '../../../user/domain/enum/user-role.enum';
import Stripe from 'stripe';
import { RequestUser } from '../../../auth/domain/interface/request-user.interface';
import { ChargeStripeRequest } from './request/charge-stripe.request';
import { AttachCreditCardRequest } from './request/attach-credit-card.request';
import { SetDefaultCreditCardStripRequest } from './request/set-default-credit-card-strip.request';
import { CreateCouponStripeRequest } from './request/create-coupon-stripe.request';
import { UpdateCouponStripeRequest } from './request/update-coupon-stripe.request';
import { InvalidIdHttpException } from '../../../../util/exception/custom-http-exception/invalid-id.http-exception';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/public/charge')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async chargeCustomer(
    @Req() requestUser: RequestUser,
    @Body() chargeStripe: ChargeStripeRequest,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    if (!requestUser.user.stripeCustomerId) {
      throw new InvalidIdHttpException('User does not have stripe customer id');
    }
    return await this.stripeService.chargeCustomer(requestUser.user.stripeCustomerId, chargeStripe);
  }

  @Post('/public/attach-credit-card')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async attachCreditCard(
    @Req() requestUser: RequestUser,
    @Body() attachCreditCard: AttachCreditCardRequest,
  ): Promise<Stripe.Response<Stripe.SetupIntent>> {
    if (!requestUser.user.stripeCustomerId) {
      throw new InvalidIdHttpException('User does not have stripe customer id');
    }
    return await this.stripeService.attachPaymentMethodToCustomer(requestUser.user.stripeCustomerId, attachCreditCard);
  }

  @Get('/public/list-saved-credit-card')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getListSavedCreditCard(@Req() requestUser: RequestUser): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    if (!requestUser.user.stripeCustomerId) {
      throw new InvalidIdHttpException('User does not have stripe customer id');
    }
    return await this.stripeService.getListSavedCreditCardOfUser(requestUser.user.stripeCustomerId);
  }

  @Put('/public/set-default-credit-card')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async setDefaultCreditCard(
    @Req() requestUser: RequestUser,
    @Body() setDefaultCreditCard: SetDefaultCreditCardStripRequest,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    if (!requestUser.user.stripeCustomerId) {
      throw new InvalidIdHttpException('User does not have stripe customer id');
    }
    return await this.stripeService.setDefaultCreditCard(requestUser.user.stripeCustomerId, setDefaultCreditCard);
  }

  @Post('/admin/create-coupon')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createCoupon(@Body() couponRequest: CreateCouponStripeRequest): Promise<Stripe.Response<Stripe.Coupon>> {
    return await this.stripeService.createCouponStripe(couponRequest);
  }

  @Put('/admin/update-coupon/:couponId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async updateCoupon(
    @Param('couponId') couponId: string,
    @Body() couponRequest: UpdateCouponStripeRequest,
  ): Promise<Stripe.Response<Stripe.Coupon>> {
    return await this.stripeService.updateCouponStripe(couponId, couponRequest);
  }

  @Delete('/admin/delete-coupon/:couponId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async deleteCoupon(@Param('couponId') couponId: string): Promise<Stripe.Response<Stripe.DeletedCoupon>> {
    return await this.stripeService.deleteCouponStripe(couponId);
  }

  @Get('/public/get-all-my-invoices')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getAllMyInvoices(@Req() requestUser: RequestUser): Promise<Stripe.ApiList<Stripe.Invoice>> {
    if (!requestUser.user.stripeCustomerId) {
      throw new InvalidIdHttpException('User does not have stripe customer id');
    }
    return await this.stripeService.getAllInvoiceByCustomerId(requestUser.user.stripeCustomerId);
  }

  @Get('/public/get-all-my-subscriptions')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getAllMySubscriptions(@Req() requestUser: RequestUser): Promise<Stripe.ApiList<Stripe.Subscription>> {
    if (!requestUser.user.stripeCustomerId) {
      throw new InvalidIdHttpException('User does not have stripe customer id');
    }
    return await this.stripeService.getAllSubscriptionsFromCustomerId(requestUser.user.stripeCustomerId);
  }

  @Get('/admin/get-all-customer-subscription/:customerId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllCustomerSubscriptions(
    @Param('customerId') customerId: string,
  ): Promise<Stripe.ApiList<Stripe.Subscription>> {
    return await this.stripeService.getAllSubscriptionsFromCustomerId(customerId);
  }

  @Get('/admin/get-all-customer-invoices/:customerId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllCustomerInvoices(@Param('customerId') customerId: string): Promise<Stripe.ApiList<Stripe.Invoice>> {
    return await this.stripeService.getAllInvoiceByCustomerId(customerId);
  }
}
