import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { UserRoleEnum } from '../enum/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  mail?: string;

  @ApiProperty()
  @Length(5, 20)
  username?: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsOptional()
  roles?: UserRoleEnum[];

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}
