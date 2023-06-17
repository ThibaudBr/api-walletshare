import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '../../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../../user/domain/enum/user-role.enum';
import { RequestUser } from '../../../auth/domain/interface/request-user.interface';
import { InvoiceService } from '../application/invoice.service';
import Stripe from 'stripe';
import { InvalidIdHttpException } from '../../../../util/exception/custom-http-exception/invalid-id.http-exception';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('/public/get-all-my-invoices')
  @ApiBearerAuth()
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getAllMyInvoices(@Req() req: RequestUser): Promise<Stripe.ApiList<Stripe.Invoice>> {
    if (!req.user.stripeCustomerId) {
      throw new InvalidIdHttpException('User does not have stripe customer id');
    }
    return await this.invoiceService.getAllMyInvoices(req.user.stripeCustomerId);
  }
}
