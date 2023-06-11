import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ReferralCodeEntity } from '../entities/referral-code.entity';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  mail?: string;

  @Length(5, 20)
  @IsNotEmpty()
  username?: string;

  password?: string;
}
