import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { CompanyEntity } from '../../../company/domain/entities/company.entity';
import { AddressEntity } from '../../domain/entities/address.entity';

@EventSubscriber()
export class CompanyAddressSubscriber implements EntitySubscriberInterface<CompanyEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return CompanyEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<CompanyEntity>): Promise<void> {
    const softRemovedCompany: CompanyEntity | undefined = event.entity;
    const addressRepository: Repository<AddressEntity> = event.manager.getRepository(AddressEntity);
    const addresses: AddressEntity[] = await addressRepository.find({
      relations: ['company'],
      where: {
        company: {
          id: softRemovedCompany?.id,
        },
      },
    });
    if (addresses.length == 0) return;
    await addressRepository.softRemove(addresses);
  }

  async beforeRemove(event: RemoveEvent<CompanyEntity>): Promise<void> {
    const removedCompany: CompanyEntity | undefined = event.entity;
    const addressRepository: Repository<AddressEntity> = event.manager.getRepository(AddressEntity);
    const addresses: AddressEntity[] = await addressRepository.find({
      relations: ['company'],
      withDeleted: true,
      where: {
        company: {
          id: removedCompany?.id,
        },
      },
    });
    if (addresses.length == 0) return;
    await addressRepository.remove(addresses);
  }
}
