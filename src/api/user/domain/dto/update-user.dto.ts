import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(5, 20)
  @IsNotEmpty()
  username: string;

  password?: string;
}
