import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateInvoiceCommand } from '../../command/create-invoice.command';
import { InvoicesEntity } from '../../../../domain/entities/invoices.entity';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceStatusEnum } from '../../../../../price/domain/invoice-status.enum';

@CommandHandler(CreateInvoiceCommand)
export class CreateInvoiceCommandHandler implements ICommandHandler<CreateInvoiceCommand> {
  constructor(
    @InjectRepository(InvoicesEntity)
    private readonly invoicesRepository: Repository<InvoicesEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateInvoiceCommand): Promise<InvoicesEntity> {
    const invoiceToCreate: InvoicesEntity = new InvoicesEntity({
      amount: command.stripeInvoice.amount_paid,
      clientAddress:
        command.stripeInvoice.customer_address?.city +
        ', ' +
        command.stripeInvoice.customer_address?.country +
        ', ' +
        command.stripeInvoice.customer_address?.line1 +
        ', ' +
        command.stripeInvoice.customer_address?.line2 +
        ', ' +
        command.stripeInvoice.customer_address?.postal_code +
        ', ' +
        command.stripeInvoice.customer_address?.state,
      clientName: command.stripeInvoice.customer_name ?? undefined,
      currency: command.stripeInvoice.currency,
      description: command.stripeInvoice.description ?? undefined,
      invoiceNumber: command.stripeInvoice.number ?? undefined,
      status: command.stripeInvoice.status ? (command.stripeInvoice.status as InvoiceStatusEnum) : undefined,
      stripeCustomerId: command.userEntity.stripeCustomerId,
      stripeInvoiceId: command.stripeInvoice.id,
      subscription: command.subscriptionEntity,
      taxRate: command.stripeInvoice.tax ?? undefined,
      totalAmount: command.stripeInvoice.total,
    });

    return await this.invoicesRepository.save(invoiceToCreate).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'payment', handler: 'CreateInvoiceCommandHandler', error: error.message }),
      );
      throw new Error('Error while saving invoice');
    });
  }
}
