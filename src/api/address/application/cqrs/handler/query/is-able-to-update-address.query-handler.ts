import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsAbleToUpdateAddressQuery } from '../../query/is-able-to-update-address.query';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from '../../../../domain/entities/address.entity';
import { Repository } from 'typeorm';
import { CompanyEmployeeEntity } from '../../../../../company/domain/entities/company-employee.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(IsAbleToUpdateAddressQuery)
export class IsAbleToUpdateAddressQueryHandler implements IQueryHandler<IsAbleToUpdateAddressQuery> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: IsAbleToUpdateAddressQuery): Promise<boolean> {
    const address: AddressEntity = await this.addressRepository
      .findOneOrFail({
        relations: [
          'user',
          'company',
          'company.employees',
          'company.employees.profile',
          'company.employees.profile.user',
        ],
        where: {
          id: query.userId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'IsAbleToUpdateAddressQueryHandler',
            localisation: 'addressRepository.findOneOrFail',
          }),
        );
        throw new Error('Address not found');
      });

    if (address.user.id != query.userId) {
      return true;
    }

    return address.company.employees
      .map((employee: CompanyEmployeeEntity) => employee.profile.user.id)
      .includes(query.userId);
  }
}
