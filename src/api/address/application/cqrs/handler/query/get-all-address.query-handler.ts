import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from '../../../../domain/entities/address.entity';
import { GetAllAddressQuery } from '../../query/get-all-address.query';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllAddressQuery)
export class GetAllAddressQueryHandler implements IQueryHandler<GetAllAddressQuery> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<AddressEntity[]> {
    return await this.addressRepository
      .find({
        relations: ['user', 'company'],
        withDeleted: true,
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetAllAddressQueryHandler',
            localisation: 'addressRepository.find',
          }),
        );
        return [];
      });
  }
}
