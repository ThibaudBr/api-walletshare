import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  @ApiProperty()
  title?: string;
  @ApiProperty()
  message?: string;

  constructor(partial: Partial<MailDto>) {
    Object.assign(this, partial);
  }
}
