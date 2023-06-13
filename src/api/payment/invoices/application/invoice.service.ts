import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { StripeService } from '../../stripe/application/stripe.service';
import { SubscriptionEntity } from '../../subscription/domain/entities/subscription.entity';
import { InvoicesEntity } from '../domain/entities/invoices.entity';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { CreateInvoiceCommand } from './cqrs/command/create-invoice.command';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly stripeService: StripeService,
  ) {}

  async getAllMyInvoices(stripeCustomerId: string): Promise<Stripe.ApiList<Stripe.Invoice>> {
    return await this.stripeService.getAllInvoiceByCustomerId(stripeCustomerId);
  }

  async createInvoiceFromStripeInvoiceId(
    latestInvoiceId: string,
    subscriptionEntity: SubscriptionEntity,
    userEntity: UserEntity,
  ): Promise<InvoicesEntity> {
    const stripeInvoice: Stripe.Invoice = await this.stripeService.getInvoiceByStripeId(latestInvoiceId);

    return await this.commandBus
      .execute(
        new CreateInvoiceCommand({
          userEntity: userEntity,
          subscriptionEntity: subscriptionEntity,
          stripeInvoice: stripeInvoice,
        }),
      )
      .catch(error => {
        if (error.message === 'Invoice already exists') throw new BadRequestException(error.message);
        if (error.message === 'Error while saving invoice') throw new BadRequestException(error.message);
        throw new InternalServerErrorException(error.message);
      });
  }
}
