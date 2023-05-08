import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateAddressCommand } from '../../command/create-address.command';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from '../../../../domain/entities/address.entity';
import { CompanyEntity } from '../../../../../company/domain/entities/company.entity';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAddressEvent } from '../../event/create-address.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(CreateAddressCommand)
export class CreateAddressCommandHandler implements ICommandHandler<CreateAddressCommand> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateAddressCommand): Promise<string> {
    if (!command.userId && !command.companyId) {
      throw new Error('User or Company must be provided');
    }

    const newAddress = new AddressEntity({
      ...command.addressDto,
    });
    if (command.userId) {
      newAddress.user = await this.userRepository
        .findOneOrFail({
          where: {
            id: command.userId,
          },
        })
        .catch(async error => {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              error: error.message,
              handler: 'CreateAddressCommandHandler',
              localisation: 'userRepository.findOneOrFail',
            }),
          );
          throw new Error('User not found');
        });
    }
    if (command.companyId) {
      newAddress.company = await this.companyRepository
        .findOneOrFail({
          where: {
            id: command.companyId,
          },
        })
        .catch(async error => {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              error: error.message,
              handler: 'CreateAddressCommandHandler',
              localisation: 'companyRepository.findOneOrFail',
            }),
          );
          throw new Error('Company not found');
        });
    }

    return await this.addressRepository
      .save(newAddress)
      .then(async (address: AddressEntity) => {
        await this.eventBus.publish(
          new CreateAddressEvent({
            addressId: address.id,
          }),
        );
        return address.id;
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'CreateAddressCommandHandler',
            localisation: 'addressRepository.save',
          }),
        );
        throw new Error('Error during address creation');
      });
  }
}
