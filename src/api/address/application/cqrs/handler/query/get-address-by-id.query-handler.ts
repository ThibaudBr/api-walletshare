import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAddressByIdQuery } from '../../query/get-address-by-id.query';
import { AddressEntity } from '../../../../domain/entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAddressByIdQuery)
export class GetAddressByIdQueryHandler implements IQueryHandler<GetAddressByIdQuery> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAddressByIdQuery): Promise<AddressEntity> {
    return await this.addressRepository
      .findOneOrFail({
        relations: ['user', 'company'],
        where: {
          id: query.addressId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'GetAddressByIdQueryHandler',
            localisation: 'addressRepository.findOneOrFail',
          }),
        );
        throw new Error('Address not found');
      });
  }
}
