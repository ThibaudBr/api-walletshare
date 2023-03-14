import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'dotenv';
import { UserService } from '../../user/user.service';
import { TokenPayload } from '../interface/token-payload.interface';
import { Request } from 'express';
import { RequestUser } from "../interface/request-user.interface";

config();
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string => {
          return request?.headers?.authorization?.split(' ')[1] || '';
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload): Promise<RequestUser> {
    const refreshToken = request?.headers?.authorization?.split(' ')[1];
    return await this.userService.getUserIfRefreshTokenMatches(refreshToken || '', payload.userId);
  }
}
