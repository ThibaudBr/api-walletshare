import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  mail?: string;

  @Length(5, 20)
  @IsNotEmpty()
  username?: string;

  password?: string;
}
