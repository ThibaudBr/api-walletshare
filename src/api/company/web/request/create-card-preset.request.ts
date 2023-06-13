import { AlignmentCardEnum } from '../../domain/enum/alignment-card.enum';

export class CreateCardPresetRequest {
  public readonly alignment: AlignmentCardEnum;
  public readonly backgroundColor: string;
  public readonly companyId: string;

  constructor(partial: Partial<CreateCardPresetRequest>) {
    Object.assign(this, partial);
  }
}
