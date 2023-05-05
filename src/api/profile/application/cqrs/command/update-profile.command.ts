import { UpdateProfileDto } from '../../../domain/dto/update-profile.dto';

export class UpdateProfileCommand {
  public readonly id: string;
  public readonly updateProfileDto: UpdateProfileDto;

  constructor(partial: Partial<UpdateProfileCommand>) {
    Object.assign(this, partial);
  }
}
