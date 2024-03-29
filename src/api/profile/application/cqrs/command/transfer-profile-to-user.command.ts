import { SignInDto } from '../../../../auth/domain/dto/sign-in.dto';

export class TransferProfileToUserCommand {
  public readonly userId: string;
  public readonly loginDto: SignInDto;

  constructor(partial: Partial<TransferProfileToUserCommand>) {
    Object.assign(this, partial);
  }
}
