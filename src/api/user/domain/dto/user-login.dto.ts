import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }

  @ApiProperty()
  public readonly login: string;
  @ApiProperty()
  public readonly password: string;
}
