import { AlignmentCardEnum } from '../../../domain/enum/alignment-card.enum';

export class CreateCardPresetCommand {
  public readonly alignment: AlignmentCardEnum;
  public readonly backgroundColor: string;
  public readonly companyId: string;

  constructor(partial: Partial<CreateCardPresetCommand>) {
    Object.assign(this, partial);
  }
}
