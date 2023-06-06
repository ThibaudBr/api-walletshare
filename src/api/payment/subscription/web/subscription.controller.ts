import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionService } from '../application/subscription.service';
import Stripe from 'stripe';
import { RoleGuard } from '../../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../../user/domain/enum/user-role.enum';
import { RequestUser } from '../../../auth/domain/interface/request-user.interface';
import { CreateSubscriptionRequest } from './request/create-subscription.request';
import { CancelSubscriptionRequest } from './request/cancel-subscription.request';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('/public/create-monthly-subscription')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async createMonthlySubscription(@Req() requestUser: RequestUser): Promise<Stripe.Response<Stripe.Subscription>> {
    return await this.subscriptionService.createMonthlySubscription(requestUser.user.stripeCustomerId);
  }

  @Get('/public/list-subscription')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getListSubscription(@Req() requestUser: RequestUser): Promise<Stripe.ApiList<Stripe.Subscription>> {
    return await this.subscriptionService.getListSubscription(requestUser.user.stripeCustomerId);
  }

  @Post('/public/create-subscription')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async createSubscription(
    @Req() requestUser: RequestUser,
    @Body() createSubscriptionRequest: CreateSubscriptionRequest,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    return await this.subscriptionService.createSubscription(
      requestUser.user.id,
      requestUser.user.stripeCustomerId,
      createSubscriptionRequest,
    );
  }

  @Post('/public/cancel-subscription')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async cancelSubscription(
    @Req() requestUser: RequestUser,
    @Body() cancelSubscriptionRequest: CancelSubscriptionRequest,
  ): Promise<void> {
    return await this.subscriptionService.handlerUserCancelSubscription(
      requestUser.user.id,
      requestUser.user.stripeCustomerId,
      cancelSubscriptionRequest.subscriptionId,
    );
  }
}
