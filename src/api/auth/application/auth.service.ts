import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../domain/interface/token-payload.interface';
import { SignUpDto } from '../domain/dto/sign-up.dto';
import { RegisterCommand } from './cqrs/command/register.command';
import { UserLoginResponse } from '../../user/web/response/user-login.response';
import { UserEntity } from '../../user/domain/entities/user.entity';
import { GetUserQuery } from '../../user/application/cqrs/query/get-user.query';
import { GetUserLoginQuery } from '../../user/application/cqrs/query/get-user-login.query';
import { UserResponse } from '../../user/web/response/user.response';
import { CreateStripeCustomerCommand } from '../../payment/stripe/application/cqrs/command/create-stripe-customer.command';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<UserResponse> {
    const user: UserEntity = await this.commandBus.execute(
      new RegisterCommand(signUpDto.username, signUpDto.mail, signUpDto.password),
    );

    await this.commandBus.execute(
      new CreateStripeCustomerCommand({
        userId: user.id,
        username: user.username,
        email: user.mail,
      }),
    );

    return new UserResponse({
      ...user,
    });
  }

  async login(username: string, plainTextPassword: string): Promise<UserEntity> {
    try {
      return await this.queryBus.execute(new GetUserLoginQuery(username, plainTextPassword));
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.UNAUTHORIZED);
    }
  }

  public getCookieWithJwtToken(userId: string): { token: string; auth: string } {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`,
    });
    return {
      token: token,
      auth: `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`,
    };
  }

  public getCookieWithJwtRefreshToken(userId: string): { cookie: string; token: string } {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    return {
      cookie,
      token,
    };
  }

  public getCookieForLogOut(): string[] {
    return ['Authentication=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0'];
  }

  async getUserFromAuthToken(authenticationToken: string): Promise<UserLoginResponse> {
    const payload: TokenPayload = this.jwtService.verify(authenticationToken, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
    });
    if (payload.userId) {
      return await this.queryBus.execute(new GetUserQuery(payload.userId));
    }
    throw new Error('Invalid token');
  }
}
