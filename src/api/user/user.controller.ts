import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { DuplicateEmailException } from '../../util/exception/custom-http-exception/duplicate-email.exception';
import { DuplicateUsernameException } from '../../util/exception/custom-http-exception/duplicate-username.exception';
import * as process from 'process';
import { CreateUserResponse } from './domain/response/create-user.response';
import { InvalidParameterEntityException } from '../../util/exception/custom-http-exception/invalid-parameter-entity.exception';

@Controller('user')
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
}
