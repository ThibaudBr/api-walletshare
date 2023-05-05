import { TypeOfCardEnum } from '../../../domain/enum/type-of-card.enum';

export class GetCardWithCriteriaQuery {
  public readonly isDeleted?: boolean = false;
  public readonly isOwnerPro?: boolean;
  public readonly firstname?: string;
  public readonly lastname?: string;
  public readonly companyName?: string;
  public readonly typeOfCardEnum?: TypeOfCardEnum;

  constructor(partial: Partial<GetCardWithCriteriaQuery>) {
    Object.assign(this, partial);
  }
}
