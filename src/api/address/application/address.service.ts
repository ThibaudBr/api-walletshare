import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAddressCommand } from './cqrs/command/create-address.command';
import { CreateAddressRequest } from '../web/request/create-address.request';
import { InvalidIdHttpException } from '../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { InvalidParameterEntityHttpException } from '../../../util/exception/custom-http-exception/invalid-parameter-entity.http-exception';
import { IsAbleToUpdateAddressQuery } from './cqrs/query/is-able-to-update-address.query';
import { IsRoleInCompanyQuery } from '../../company/application/cqrs/query/is-role-in-company.query';
import { RoleCompanyEmployeeEnum } from '../../company/domain/enum/role-company-employee.enum';
import { UnauthorizedRequestHttpException } from '../../../util/exception/custom-http-exception/unauthorized-request.http-exception';
import { AddressResponse } from '../web/response/address.response';
import { GetAllAddressQuery } from './cqrs/query/get-all-address.query';
import { GetAddressByIdQuery } from './cqrs/query/get-address-by-id.query';
import { RemoveAddressCommand } from './cqrs/command/remove-address.command';
import { UpdateAddressCommand } from './cqrs/command/update-address.command';
import { UpdateAddressRequest } from '../web/request/update-address.request';
import { RestoreAddressCommand } from './cqrs/command/restore-address.command';
import { SoftRemoveAddressCommand } from './cqrs/command/soft-remove-address.command';

@Injectable()
export class AddressService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async createAddress(userId: string, createAddressRequest: CreateAddressRequest): Promise<string> {
    if (createAddressRequest.companyId) {
      if (
        !(await this.commandBus.execute(
          new IsRoleInCompanyQuery({
            userId: userId,
            companyId: createAddressRequest.companyId,
            roles: [RoleCompanyEmployeeEnum.OWNER, RoleCompanyEmployeeEnum.ADMIN],
          }),
        ))
      ) {
        throw new UnauthorizedRequestHttpException();
      }
    }
    return await this.commandBus.execute(new CreateAddressCommand(createAddressRequest)).catch(error => {
      if (error.message === 'User not found') throw new InvalidIdHttpException('for user');
      if (error.message === 'Company not found') throw new InvalidIdHttpException('for company');
      if (error.message instanceof Array) throw new InvalidParameterEntityHttpException(error);
      if (error.message === 'User or Company must be provided')
        throw new InvalidIdHttpException('must provide id for user or company');
      throw new InternalServerErrorException(error.message);
    });
  }

  async removeAddress(id: string): Promise<void> {
    await this.commandBus
      .execute(
        new RemoveAddressCommand({
          addressId: id,
        }),
      )
      .catch(error => {
        if (error.message === 'Address not found') throw new InvalidIdHttpException('for address');
        throw new InternalServerErrorException(error.message);
      });
  }

  async restoreAddress(id: string): Promise<void> {
    await this.commandBus
      .execute(
        new RestoreAddressCommand({
          addressId: id,
        }),
      )
      .catch(error => {
        if (error.message === 'Address not found') throw new InvalidIdHttpException('for address');
        throw new InternalServerErrorException(error.message);
      });
  }

  async softRemoveAddress(id: string): Promise<void> {
    await this.commandBus
      .execute(
        new SoftRemoveAddressCommand({
          addressId: id,
        }),
      )
      .catch(error => {
        if (error.message === 'Address not found') throw new InvalidIdHttpException('for address');
        throw new InternalServerErrorException(error.message);
      });
  }

  async softRemoveAddressByUser(userId: string, addressId: string): Promise<void> {
    if (!(await this.isAbleToUpdateAddress(userId, addressId))) throw new UnauthorizedRequestHttpException();
    await this.commandBus
      .execute(
        new SoftRemoveAddressCommand({
          addressId: addressId,
        }),
      )
      .catch(error => {
        if (error.message === 'Address not found') throw new InvalidIdHttpException('for address');
        throw new InternalServerErrorException(error.message);
      });
  }

  async updateAddressByAdmin(addressId: string, updateAddressRequest: UpdateAddressRequest): Promise<void> {
    await this.commandBus
      .execute(
        new UpdateAddressCommand({
          addressId: addressId,
          addressDto: updateAddressRequest,
        }),
      )
      .catch(error => {
        if (error.message === 'Address not found') throw new InvalidIdHttpException('for address');
        if (error.message === 'User not found') throw new InvalidIdHttpException('for user');
        if (error.message === 'Company not found') throw new InvalidIdHttpException('for company');
        if (error.message instanceof Array) throw new InvalidParameterEntityHttpException(error);
        if (error.message === 'User or Company must be provided')
          throw new InvalidIdHttpException('must provide id for user or company');
        throw new InternalServerErrorException(error.message);
      });
  }

  async updateAddressByUser(
    userId: string,
    addressId: string,
    updateAddressRequest: UpdateAddressRequest,
  ): Promise<void> {
    if (!(await this.isAbleToUpdateAddress(userId, addressId))) throw new UnauthorizedRequestHttpException();
    await this.commandBus
      .execute(
        new UpdateAddressCommand({
          addressId: addressId,
          addressDto: updateAddressRequest,
        }),
      )
      .catch(error => {
        if (error.message === 'Address not found') throw new InvalidIdHttpException('for address');
        if (error.message === 'User not found') throw new InvalidIdHttpException('for user');
        if (error.message === 'Company not found') throw new InvalidIdHttpException('for company');
        if (error.message instanceof Array) throw new InvalidParameterEntityHttpException(error);
        if (error.message === 'User or Company must be provided')
          throw new InvalidIdHttpException('must provide id for user or company');
        throw new InternalServerErrorException(error.message);
      });
  }

  async getAllAddress(): Promise<AddressResponse[]> {
    return await this.queryBus.execute(new GetAllAddressQuery());
  }

  async getAddressById(userId: string, addressId: string): Promise<AddressResponse> {
    if (!(await this.isAbleToUpdateAddress(userId, addressId))) throw new UnauthorizedRequestHttpException();
    return await this.queryBus
      .execute(
        new GetAddressByIdQuery({
          addressId: addressId,
        }),
      )
      .catch(error => {
        if (error.message === 'Address not found') throw new InvalidIdHttpException('for address');
        throw new InternalServerErrorException(error.message);
      });
  }

  async getAddressByIdAdmin(addressId: string): Promise<AddressResponse> {
    return await this.queryBus
      .execute(
        new GetAddressByIdQuery({
          addressId: addressId,
        }),
      )
      .catch(error => {
        if (error.message === 'Address not found') throw new InvalidIdHttpException('for address');
        throw new InternalServerErrorException(error.message);
      });
  }

  async isAbleToUpdateAddress(userId: string, addressId: string): Promise<boolean> {
    return await this.queryBus
      .execute(
        new IsAbleToUpdateAddressQuery({
          userId: userId,
          addressId: addressId,
        }),
      )
      .catch(error => {
        if (error.message === 'Address not found') throw new InvalidIdHttpException('for address');
        throw new InternalServerErrorException(error.message);
      });
  }

  async createAddressAdmin(createAddressRequest: CreateAddressRequest): Promise<void> {
    return await this.commandBus.execute(new CreateAddressCommand(createAddressRequest)).catch(error => {
      if (error.message === 'User not found') throw new InvalidIdHttpException('for user');
      if (error.message === 'Company not found') throw new InvalidIdHttpException('for company');
      if (error.message instanceof Array) throw new InvalidParameterEntityHttpException(error);
      if (error.message === 'User or Company must be provided')
        throw new InvalidIdHttpException('must provide id for user or company');
      throw new InternalServerErrorException(error.message);
    });
  }
}
