import { AlignmentCardEnum } from '../../../domain/enum/alignment-card.enum';

export class CreateCardPresetCommand {
  constructor(partial: Partial<CreateCardPresetCommand>) {
    Object.assign(this, partial);
  }

  public readonly alignment: AlignmentCardEnum;
  public readonly backgroundColor: string;
  public readonly companyId: string;
}
