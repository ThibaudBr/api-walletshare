import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}
