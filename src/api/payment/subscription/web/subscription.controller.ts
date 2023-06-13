import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionService } from '../application/subscription.service';
import Stripe from 'stripe';
import { RoleGuard } from '../../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../../user/domain/enum/user-role.enum';
import { RequestUser } from '../../../auth/domain/interface/request-user.interface';
import { CancelSubscriptionRequest } from './request/cancel-subscription.request';
import { SubscriptionEntity } from '../domain/entities/subscription.entity';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('/public/list-subscription/:stripePriceId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getListSubscription(
    @Req() requestUser: RequestUser,
    @Param('stripePriceId') stripePriceId: string,
  ): Promise<Stripe.ApiList<Stripe.Subscription>> {
    return await this.subscriptionService.getListSubscription(requestUser.user.stripeCustomerId, stripePriceId);
  }

  // @Post('/public/create-subscription')
  // @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  // async createSubscription(
  //   @Req() requestUser: RequestUser,
  //   @Body() createSubscriptionRequest: CreateSubscriptionRequest,
  // ): Promise<Stripe.Response<Stripe.Subscription>> {
  //   return await this.subscriptionService.createSubscription(
  //     requestUser.user.id,
  //     requestUser.user.stripeCustomerId,
  //     createSubscriptionRequest,
  //   );
  // }

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

  @Get('/admin/get-all-active-subscriptions-count')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllSubscriptionsCount(): Promise<number> {
    return await this.subscriptionService.getAllActiveSubscriptionsCount();
  }

  @Get('/admin/get-all-subscriptions')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllSubscriptions(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionService.getAllSubscriptions();
  }
}
