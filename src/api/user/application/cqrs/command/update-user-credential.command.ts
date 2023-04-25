import { UpdateUserCredentialDto } from '../../../domain/dto/update-user-credential.dto';

export class UpdateUserCredentialCommand {
  public readonly userId: string;
  public readonly updateUserCredentialDto: UpdateUserCredentialDto;

  constructor(partial: Partial<UpdateUserCredentialCommand>) {
    Object.assign(this, partial);
  }
}
