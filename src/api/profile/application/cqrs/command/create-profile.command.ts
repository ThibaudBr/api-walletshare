import { CreateProfileDto } from '../../../domain/dto/create-profile.dto';

export class CreateProfileCommand {
  public readonly userId: string;
  public readonly occupationsId: string[];
  public readonly createProfileDto: CreateProfileDto;

  constructor(partial: Partial<CreateProfileCommand>) {
    Object.assign(this, partial);
  }
}
