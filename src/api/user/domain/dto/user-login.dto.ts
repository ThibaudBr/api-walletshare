import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty()
  public readonly login: string;
  @ApiProperty()
  public readonly password: string;

  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }
}
