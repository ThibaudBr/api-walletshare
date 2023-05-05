import { CreateOccupationDto } from '../../../domain/dto/create-occupation.dto';

export class CreateOccupationCommand {
  public readonly createOccupationDto: CreateOccupationDto;

  constructor(partial: Partial<CreateOccupationCommand>) {
    Object.assign(this, partial);
  }
}
