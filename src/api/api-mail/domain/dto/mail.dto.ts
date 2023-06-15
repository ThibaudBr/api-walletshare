import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MailDto {
  public readonly path: string;
  public readonly language?: string = 'fr';

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  public readonly email: string;
  @ApiProperty()
  public readonly title?: string;

  @ApiProperty()
  public readonly message?: string;
  public readonly password?: string;

  constructor(partial: Partial<MailDto>) {
    Object.assign(this, partial);
  }
}
