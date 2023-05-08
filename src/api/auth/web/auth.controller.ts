import { SignUpDto } from '../domain/dto/sign-up.dto';
import { AuthService } from '../application/auth.service';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserEntity } from '../../user/domain/entities/user.entity';
import { LocalAuthenticationGuard } from './guards/auth.guard';
import { RequestUser } from '../domain/interface/request-user.interface';
import { Response } from 'express';
import JwtRefreshGuard from './guards/jwt-refresh-token.guard';
import { UserService } from '../../user/application/user.service';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from './guards/role.guard';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { MessagePattern } from '@nestjs/microservices';
import { UserLoginResponse } from '../../user/web/response/user-login.response';
import { UserResponse } from '../../user/web/response/user.response';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Post('/register')
  async signUp(@Body() signUpDto: SignUpDto): Promise<UserResponse | HttpException> {
    try {
      return await this.authService.signup(signUpDto);
    } catch (error) {
      throw new HttpException(
        {
          type: error.message.split(':')[0],
          error: error.message.split(':')[1],
        },
        400,
      );
    }
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('/login')
  async signIn(@Req() request: RequestUser, @Res() response: Response): Promise<Response> {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtToken(user.id);
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.userService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);
    if (!request.res) {
      throw new Error('Response object missing');
    }

    request.res.setHeader('Set-Cookie', [accessTokenCookie.auth, refreshTokenCookie.cookie]);
    user.currentHashedRefreshToken = refreshTokenCookie.token;
    user.jwtToken = accessTokenCookie.token;
    user.password = '';
    return response.send(user);
  }

  @HttpCode(204)
  @UseGuards(JwtRefreshGuard)
  @Post('/logout')
  async logOut(@Req() request: RequestUser, @Res() response: Response): Promise<Response> {
    await this.userService.removeRefreshToken(request.user.id);
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(204);
  }

  //getCurrentUser
  @UseGuards(JwtRefreshGuard)
  @Get('/actual')
  authenticate(@Req() request: RequestUser): UserEntity {
    return request.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  refresh(@Req() request: RequestUser): UserEntity {
    const accessTokenCookie = this.authService.getCookieWithJwtToken(request.user.id);

    if (!request.res) {
      throw new Error('Response object missing');
    }

    request.res.setHeader('Set-Cookie', accessTokenCookie.token);
    return request.user;
  }

  // MessagePatern

  @MessagePattern({ cmd: 'validate-token' })
  async validateToken(data: string): Promise<UserLoginResponse> {
    try {
      return await this.authService.getUserFromAuthToken(data);
    } catch (e) {
      throw new HttpException('Wrong token provided', HttpStatus.BAD_REQUEST);
    }
  }
}
