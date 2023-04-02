import { CreateOccupationDto } from '../../domain/dto/create-occupation.dto';

export class CreateOccupationCommand {
  constructor(partial: Partial<CreateOccupationCommand>) {
    Object.assign(partial);
  }

  public readonly createOccupationDto: CreateOccupationDto;
}
