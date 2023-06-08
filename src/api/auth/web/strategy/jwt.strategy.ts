import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../../domain/interface/token-payload.interface';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string => {
          return request?.headers?.authorization?.split(' ')[1] ?? '';
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenPayload): Promise<UserEntity> {
    return await this.userRepository.findOneOrFail({
      where: [{ id: payload.userId }],
    });
  }
}
