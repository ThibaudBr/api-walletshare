import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../application/product.service';
import { ProductResponse } from './response/product.response';
import { UserRoleEnum } from '../../../user/domain/enum/user-role.enum';
import { RoleGuard } from '../../../auth/web/guards/role.guard';
import { CreateProductRequest } from './request/create-product.request';
import { UpdateProductRequest } from './request/update-product.request';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/public/list-product?:offset&:limit')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getListProduct(@Param('offset') offset: number, @Param('limit') limit: number): Promise<ProductResponse[]> {
    return await this.productService.getProducts(limit, offset);
  }

  @Get('/admin/list-product-admin?:offset&:limit')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getListProductAdmin(
    @Param('offset') offset: number,
    @Param('limit') limit: number,
  ): Promise<ProductResponse[]> {
    return await this.productService.getProductsAdmin(limit, offset);
  }

  @Get('/public/get-product/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getProduct(@Param('id') id: string): Promise<ProductResponse> {
    return await this.productService.getProductById(id);
  }

  @Get('/admin/get-product-admin/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getProductAdmin(@Param('id') id: string): Promise<ProductResponse> {
    return await this.productService.getProductByIdAdmin(id);
  }

  @Post('/admin/create-product')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createProduct(@Body() createProduct: CreateProductRequest): Promise<void> {
    return await this.productService.createProduct(createProduct);
  }

  @Put('/admin/update-product')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async updateProduct(@Body() updateProduct: UpdateProductRequest): Promise<void> {
    return await this.productService.updateProduct(updateProduct);
  }

  @Delete('/admin/remove-product/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return await this.productService.removeProduct(id);
  }

  @Delete('/admin/soft-remove-product/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async softDeleteProduct(@Param('id') id: string): Promise<void> {
    return await this.productService.softRemoveProduct(id);
  }

  @Put('/admin/restore-product/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async restoreProduct(@Param('id') id: string): Promise<void> {
    return await this.productService.restoreProduct(id);
  }
}
