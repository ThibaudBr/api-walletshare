import { UpdateOccupationDto } from '../../../domain/dto/update-occupation.dto';

export class UpdateOccupationCommand {
  public readonly updateOccupationDto: UpdateOccupationDto;
  public readonly occupationId: string;

  constructor(partial: Partial<UpdateOccupationCommand>) {
    Object.assign(this, partial);
  }
}
