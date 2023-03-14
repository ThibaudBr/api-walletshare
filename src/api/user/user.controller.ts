import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { CreateUserResponse } from './domain/response/create-user.response';
import { UpdateUserDto } from './domain/dto/update-user.dto';
import JwtRefreshGuard from '../auth/guards/jwt-refresh-token.guard';
import { RequestUser } from '../auth/interface/request-user.interface';
import { ApiTags } from '@nestjs/swagger';
import { UserResponse } from './domain/response/user.response';
import { RoleGuard } from "../auth/guards/role.guard";
import { UserRoleEnum } from "./domain/enum/user-role.enum";

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponse | HttpException> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      return new HttpException(
        {
          type: error.message.split(':')[0],
          error: error.message.split(':')[1],
        },
        error.status,
      );
    }
  }

  @Get()
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  findAll(): Promise<UserResponse[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.findOne(id);
  }

  @Put('')
  @UseGuards(JwtRefreshGuard)
  update(@Req() request: RequestUser, @Body() updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const { user } = request;
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtRefreshGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
