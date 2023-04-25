import { CreateOccupationDto } from '../../../domain/dto/create-occupation.dto';

export class CreateOccupationCommand {
  constructor(partial: Partial<CreateOccupationCommand>) {
    Object.assign(this, partial);
  }

  public readonly createOccupationDto: CreateOccupationDto;
}
