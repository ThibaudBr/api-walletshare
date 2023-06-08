import { AlignmentCardEnum } from '../../domain/enum/alignment-card.enum';

export class CreateCardPresetRequest {
  constructor(partial: Partial<CreateCardPresetRequest>) {
    Object.assign(this, partial);
  }

  public readonly alignment: AlignmentCardEnum;
  public readonly backgroundColor: string;
  public readonly companyId: string;
}
