import { UpdateOccupationDto } from '../../../domain/dto/update-occupation.dto';

export class UpdateOccupationCommand {
  constructor(partial: Partial<UpdateOccupationCommand>) {
    Object.assign(this, partial);
  }

  public readonly updateOccupationDto: UpdateOccupationDto;
  public readonly occupationId: string;
}
