import { AlignmentCardEnum } from '../../domain/enum/alignment-card.enum';

export class UpdateCardPresetRequest {
  constructor(partial: Partial<UpdateCardPresetRequest>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly alignment: AlignmentCardEnum;
  public readonly backgroundColor: string;
}
