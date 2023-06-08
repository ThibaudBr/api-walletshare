import { AlignmentCardEnum } from '../../../domain/enum/alignment-card.enum';

export class UpdateCardPresetCommand {
  constructor(partial: Partial<UpdateCardPresetCommand>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly alignment: AlignmentCardEnum;
  public readonly backgroundColor: string;
}
