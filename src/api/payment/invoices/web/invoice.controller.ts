import {Controller, Get, Req, UseGuards} from "@nestjs/common";
import {ApiBearerAuth} from "@nestjs/swagger";
import {RoleGuard} from "../../../auth/web/guards/role.guard";
import {UserRoleEnum} from "../../../user/domain/enum/user-role.enum";
import {RequestUser} from "../../../auth/domain/interface/request-user.interface";
import {InvoiceService} from "../application/invoice.service";
import Stripe from "stripe";

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('/public/get-all-my-invoices')
  @ApiBearerAuth()
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getAllMyInvoices(@Req() req: RequestUser): Promise<Stripe.Response<Stripe.Invoice>> {
    return await this.invoiceService.getAllMyInvoices(req.user.stripeCustomerId);
  }
}
