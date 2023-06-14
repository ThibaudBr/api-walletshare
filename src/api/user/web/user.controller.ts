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
import { UserService } from '../application/user.service';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { CreateUserResponse } from './response/create-user.response';
import { UpdateUserDto } from '../domain/dto/update-user.dto';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';
import { ApiTags } from '@nestjs/swagger';
import { UserResponse } from './response/user.response';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../domain/enum/user-role.enum';
import { GetUserWithCriteriaDto } from '../domain/dto/get-user-with-criteria.dto';
import { UpdateUserCredentialDto } from '../domain/dto/update-user-credential.dto';
import { GenerateUserDto } from '../domain/dto/generate-user.dto';
import { ListRolesDto } from '../domain/dto/list-roles.dto';
import { UserIdDto } from '../domain/dto/user-id.dto';
import { SaveUserLoginResponse } from './response/save-user-login.response';
import { ConfigService } from '@nestjs/config';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {}

  @Post('/admin/create')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createUser(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponse> {
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

  @Post('/admin/create/:passwordSuperAdmin')
  async createSuperAdmin(
    @Param('passwordSuperAdmin') passwordSuperAdmin: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    if (passwordSuperAdmin !== this.configService.get('PASSWORD_SUPER_ADMIN')) {
      throw new HttpException(
        {
          message: 'Password super admin is not correct',
        },
        403,
      );
    }
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
  async generateUserFromMail(@Body() generateUserDto: GenerateUserDto): Promise<CreateUserResponse> {
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
  async restoreUser(@Body() userId: UserIdDto): Promise<void> {
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

  @Get('/admin/get-all-user')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async findAll(): Promise<UserResponse[]> {
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
  async findOne(@Param('id') id: string): Promise<UserResponse> {
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
  async findWithCriteria(@Body() getUserWithCriteriaDto: GetUserWithCriteriaDto): Promise<UserResponse[]> {
    try {
      return await this.userService.findWithCriteria(getUserWithCriteriaDto);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        error.status,
      );
    }
  }

  @Get('/public/get-me')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getMe(@Req() requestUser: RequestUser): Promise<UserResponse> {
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
  async update(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponse> {
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
  async updateRole(@Param('id') id: string, @Body() roles: ListRolesDto): Promise<UserResponse> {
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
  async updateMe(@Req() requestUser: RequestUser, @Body() updateUserDto: UpdateUserDto): Promise<UserResponse> {
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
  ): Promise<UserResponse> {
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
  async remove(@Req() requestUser: RequestUser, @Param('id') id: string): Promise<void> {
    try {
      return await this.userService.remove(id);
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
  async deleteMe(@Req() requestUser: RequestUser): Promise<void> {
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
  async fullDelete(@Param('id') id: string): Promise<void> {
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

  @HttpCode(200)
  @Get('/public/get-my-last-login')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getMyLastLogin(@Req() requestUser: RequestUser): Promise<SaveUserLoginResponse[]> {
    return await this.userService.getLoginHistory(requestUser.user.id);
  }

  @HttpCode(200)
  @Get('/admin/get-user-last-login/:id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getUserLastLogin(@Param('id') id: string): Promise<SaveUserLoginResponse[]> {
    return await this.userService.getLoginHistory(id);
  }

  @HttpCode(200)
  @Get('/admin/get-all-user-count')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllUserCount(): Promise<number> {
    return await this.userService.getAllUserCount();
  }
}
