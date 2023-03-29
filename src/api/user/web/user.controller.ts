import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { CreateUserResponse } from '../domain/response/create-user.response';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { RequestUser } from '../../auth/interface/request-user.interface';
import { ApiTags } from '@nestjs/swagger';
import { UserResponse } from '../domain/response/user.response';
import { RoleGuard } from '../../auth/guards/role.guard';
import { UserRoleEnum } from '../domain/enum/user-role.enum';
import { GetUserWithCriteriaDto } from '../domain/dto/get-user-with-criteria.dto';
import { UpdateUserCredentialDto } from '../domain/dto/update-user-credential.dto';
import { GenerateUserDto } from '../domain/dto/generate-user.dto';
import { ListRolesDto } from '../domain/dto/list-roles.dto';
import { UserIdDto } from '../domain/dto/user-id.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/admin/create')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createUser(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponse | HttpException> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @Post('/admin/generate-user-from-mail')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async generateUserFromMail(@Body() generateUserDto: GenerateUserDto): Promise<CreateUserResponse | HttpException> {
    try {
      return await this.userService.generateUserFromMail(generateUserDto);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @HttpCode(204)
  @Post('/admin/restore-user')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async restoreUser(@Body() userId: UserIdDto): Promise<void | HttpException> {
    try {
      return await this.userService.restoreUser(userId.userId);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }
  @Get('/admin/')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async findAll(): Promise<UserResponse[] | HttpException> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @Get('/admin/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async findOne(@Param('id') id: string): Promise<UserResponse | HttpException> {
    try {
      return await this.userService.findOne(id);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @HttpCode(200)
  @Post('/admin/criteria')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async findWithCriteria(
    @Body() getUserWithCriteriaDto: GetUserWithCriteriaDto,
  ): Promise<UserResponse[] | HttpException> {
    try {
      return await this.userService.findWithCriteria(getUserWithCriteriaDto);
    } catch (error) {
      return new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @Get('/public/get-me')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getMe(@Req() requestUser: RequestUser): Promise<UserResponse | HttpException> {
    try {
      const { user } = requestUser;
      return await this.userService.findMe(user.id);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @Put('/admin/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse | HttpException> {
    try {
      return await this.userService.update(userId, updateUserDto);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @HttpCode(204)
  @Put('/admin/:id/role')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async updateRole(@Param('id') id: string, @Body() roles: ListRolesDto): Promise<UserResponse | HttpException> {
    try {
      return await this.userService.updateRoles(id, roles.roles);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @Put('/public/update-me')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async updateMe(
    @Req() requestUser: RequestUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse | HttpException> {
    try {
      return await this.userService.update(requestUser.user.id, updateUserDto);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @Put('/public/update-password')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async updatePassword(
    @Req() requestUser: RequestUser,
    @Body() updateUserCredentialDto: UpdateUserCredentialDto,
  ): Promise<UserResponse | HttpException> {
    try {
      return await this.userService.updatePassword(requestUser.user.id, updateUserCredentialDto);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @HttpCode(204)
  @Delete('/admin/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  remove(@Req() requestUser: RequestUser, @Param('id') id: string): Promise<void> {
    try {
      return this.userService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @HttpCode(204)
  @Delete('/public/delete-me')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async deleteMe(@Req() requestUser: RequestUser): Promise<void | HttpException> {
    try {
      return await this.userService.deleteMe(requestUser.user.id);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @HttpCode(204)
  @Delete('/admin/full-delete/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async fullDelete(@Param('id') id: string): Promise<void | HttpException> {
    try {
      return await this.userService.fullDelete(id);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }
}
