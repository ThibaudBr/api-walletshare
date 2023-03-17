import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MailDto {
  constructor(partial: Partial<MailDto>) {
    Object.assign(this, partial);
  }

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @ApiProperty()
  title?: string;

  @ApiProperty()
  message?: string;
}
