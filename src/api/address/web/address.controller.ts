import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AddressService } from '../application/address.service';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { AddressResponse } from './response/address.response';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';
import { CreateAddressRequest } from './request/create-address.request';
import { UpdateAddressRequest } from './request/update-address.request';
import { ApiTags } from '@nestjs/swagger';

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/public/get-address-by-id/:addressId')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async getAddressById(
    @Param('addressId') addressId: string,
    @Req() requestUser: RequestUser,
  ): Promise<AddressResponse> {
    const userId = requestUser.user.id;
    return await this.addressService.getAddressById(userId, addressId);
  }

  @Get('/admin/get-address-by-id/:addressId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAddressByIdAdmin(@Param('addressId') addressId: string): Promise<AddressResponse> {
    return await this.addressService.getAddressByIdAdmin(addressId);
  }

  @Get('/admin/get-all-address')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllAddress(): Promise<AddressResponse[]> {
    return await this.addressService.getAllAddress();
  }

  @Post('/public/create-address')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async createAddress(
    @Req() requestUser: RequestUser,
    @Body() createAddressRequest: CreateAddressRequest,
  ): Promise<string> {
    const userId = requestUser.user.id;
    return await this.addressService.createAddress(userId, createAddressRequest);
  }

  @Post('/admin/create-address')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createAddressAdmin(@Body() createAddressRequest: CreateAddressRequest): Promise<void> {
    return await this.addressService.createAddressAdmin(createAddressRequest);
  }

  @Delete('/admin/remove-address/:addressId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async removeAddress(@Param('addressId') addressId: string): Promise<void> {
    await this.addressService.removeAddress(addressId);
  }

  @Put('/admin/restore-address/:addressId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async restoreAddress(@Param('addressId') addressId: string): Promise<void> {
    await this.addressService.restoreAddress(addressId);
  }

  @Delete('/public/remove-address/:addressId')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async softRemoveAddress(@Param('addressId') addressId: string, @Req() requestUser: RequestUser): Promise<void> {
    const userId = requestUser.user.id;
    await this.addressService.softRemoveAddressByUser(userId, addressId);
  }

  @Delete('/admin/soft-remove-address/:addressId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async softRemoveAddressAdmin(@Param('addressId') addressId: string): Promise<void> {
    await this.addressService.softRemoveAddress(addressId);
  }

  @Put('/public/update-address/:addressId')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async updateAddress(
    @Param('addressId') addressId: string,
    @Req() requestUser: RequestUser,
    @Body() updateAddressRequest: UpdateAddressRequest,
  ): Promise<void> {
    const userId = requestUser.user.id;
    await this.addressService.updateAddressByUser(userId, addressId, updateAddressRequest);
  }

  @Put('/admin/update-address/:addressId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async updateAddressAdmin(
    @Param('addressId') addressId: string,
    @Body() updateAddressRequest: UpdateAddressRequest,
  ): Promise<void> {
    await this.addressService.updateAddressByAdmin(addressId, updateAddressRequest);
  }
}
