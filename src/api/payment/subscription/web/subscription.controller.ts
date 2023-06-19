import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionService } from '../application/subscription.service';
import Stripe from 'stripe';
import { RoleGuard } from '../../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../../user/domain/enum/user-role.enum';
import { RequestUser } from '../../../auth/domain/interface/request-user.interface';
import { CancelSubscriptionRequest } from './request/cancel-subscription.request';
import { SubscriptionEntity } from '../domain/entities/subscription.entity';
import { InvalidIdHttpException } from '../../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { CreateSubscriptionRequest } from './request/create-subscription.request';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('/public/list-subscription/:stripePriceId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getListSubscription(
    @Req() requestUser: RequestUser,
    @Param('stripePriceId') stripePriceId: string,
  ): Promise<Stripe.ApiList<Stripe.Subscription>> {
    if (!requestUser.user.stripeCustomerId) {
      throw new InvalidIdHttpException('User does not have stripe customer id');
    }
    return await this.subscriptionService.getListSubscription(requestUser.user.stripeCustomerId, stripePriceId);
  }

  @Post('/public/create-subscription')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async createSubscription(
    @Req() requestUser: RequestUser,
    @Body() createSubscriptionRequest: CreateSubscriptionRequest,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    if (!requestUser.user.stripeCustomerId) {
      throw new InvalidIdHttpException('User does not have stripe customer id');
    }
    if (requestUser.user.stripeCustomerId !== createSubscriptionRequest.customerId) {
      throw new InvalidIdHttpException('User does not have stripe customer id');
    }
    return await this.subscriptionService.createSubscription(createSubscriptionRequest);
  }

  @Post('/public/cancel-subscription')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async cancelSubscription(
    @Req() requestUser: RequestUser,
    @Body() cancelSubscriptionRequest: CancelSubscriptionRequest,
  ): Promise<void> {
    if (!requestUser.user.stripeCustomerId) {
      throw new InvalidIdHttpException('User does not have stripe customer id');
    }
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

  @Delete('/admin/remove-subscription/:subscriptionId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async removeSubscription(@Param('subscriptionId') id: string): Promise<void> {
    return await this.subscriptionService.removeSubscription(id);
  }
}
