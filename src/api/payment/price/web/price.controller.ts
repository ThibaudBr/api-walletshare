import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PriceService } from '../application/price.service';
import { RoleGuard } from '../../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../../user/domain/enum/user-role.enum';
import { PriceResponse } from './response/price.response';
import { CreatePriceStripeRequest } from '../../stripe/web/request/create-price-stripe.request';
import { UpdatePriceStripeRequest } from '../../stripe/web/request/update-price-stripe.request';

@Controller('price')
@ApiTags('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('/public/get-price-by-id/:id')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async getPriceById(@Param('id') id: string): Promise<PriceResponse> {
    return await this.priceService.getPriceById(id);
  }

  @Get('/admin/get-all-price')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async getAllPrice(): Promise<PriceResponse[]> {
    return await this.priceService.getAllPrices();
  }

  @Get('/public/get-all-price-by-product-id/:productId')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN]))
  async getAllPriceByProductId(@Param('productId') productId: string): Promise<PriceResponse[]> {
    return await this.priceService.getAllPriceByProductId(productId);
  }

  @Post('/admin/create-price')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createPrice(@Body() createPriceRequest: CreatePriceStripeRequest): Promise<void> {
    return await this.priceService.createPrice(createPriceRequest);
  }

  @Put('/admin/update-price')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async updatePrice(@Body() updatePriceRequest: UpdatePriceStripeRequest): Promise<void> {
    return await this.priceService.updatePrice(updatePriceRequest);
  }

  @Delete('/admin/remove-price/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async removePrice(@Param('id') id: string): Promise<void> {
    return await this.priceService.removePrice(id);
  }

  @Put('/admin/restore-price/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async restorePrice(@Param('id') id: string): Promise<void> {
    return await this.priceService.restorePrice(id);
  }

  @Delete('/admin/soft-remove-price/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async softRemovePrice(@Param('id') id: string): Promise<void> {
    return await this.priceService.softRemovePrice(id);
  }
}
