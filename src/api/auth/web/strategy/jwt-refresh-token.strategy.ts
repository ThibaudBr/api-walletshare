import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'dotenv';
import { UserService } from '../../../user/application/user.service';
import { TokenPayload } from '../../domain/interface/token-payload.interface';
import { Request } from 'express';
import { RequestUser } from '../../domain/interface/request-user.interface';
import { ConfigService } from '@nestjs/config';

config();

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string => {
          return request?.headers?.authorization?.split(' ')[1] ?? '';
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload): Promise<RequestUser> {
    const refreshToken = request?.headers?.authorization?.split(' ')[1];
    return await this.userService.getUserIfRefreshTokenMatches(refreshToken ?? '', payload.userId);
  }
}
