import { SubscriptionEntity } from '../../../subscription/domain/entities/subscription.entity';
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { InvoicesEntity } from '../../domain/entities/invoices.entity';

@EventSubscriber()
export class SubscriptionInvoiceSubscriber implements EntitySubscriberInterface<SubscriptionEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return SubscriptionEntity;
  }

  async beforeRemove(event: RemoveEvent<SubscriptionEntity>): Promise<void> {
    const removedSubscription: SubscriptionEntity | undefined = event.entity;
    const invoiceRepository: Repository<InvoicesEntity> = event.manager.getRepository(InvoicesEntity);
    const invoices: InvoicesEntity[] = await invoiceRepository.find({
      relations: ['subscription'],
      withDeleted: true,
      where: {
        subscription: {
          id: removedSubscription?.id,
        },
      },
    });
    if (invoices.length == 0) return;
    for (const invoice of invoices) {
      await invoiceRepository.remove(invoice).catch(error => {
        console.log(error);
      });
    }
  }

  async beforeSoftRemove(event: SoftRemoveEvent<SubscriptionEntity>): Promise<void> {
    const softRemovedSubscription: SubscriptionEntity | undefined = event.entity;
    const invoiceRepository: Repository<InvoicesEntity> = event.manager.getRepository(InvoicesEntity);
    const invoices: InvoicesEntity[] = await invoiceRepository.find({
      relations: ['subscription'],
      where: {
        subscription: {
          id: softRemovedSubscription?.id,
        },
      },
    });
    if (invoices.length == 0) return;
    for (const invoice of invoices) {
      await invoiceRepository.softRemove(invoice).catch(error => {
        console.log(error);
      });
    }
  }
}
