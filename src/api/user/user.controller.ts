import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./domain/dto/create-user.dto";
import { CreateUserResponse } from "./domain/response/create-user.response";
import { UpdateUserDto } from "./domain/dto/update-user.dto";
import { RequestUser } from "../auth/interface/request-user.interface";
import { ApiTags } from "@nestjs/swagger";
import { UserResponse } from "./domain/response/user.response";
import { RoleGuard } from "../auth/guards/role.guard";
import { UserRoleEnum } from "./domain/enum/user-role.enum";

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
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

  @Post('/create-user-from-mail')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))

  @Get()
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  findAll(): Promise<UserResponse[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC]))
  findOne(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.findOne(id);
  }

  @Put('')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  update(@Req() request: RequestUser, @Body() updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const { user } = request;
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
