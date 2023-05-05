import { TypeOfCardEnum } from '../../domain/enum/type-of-card.enum';

export class GetCardWithCriteriaRequest {
  public readonly isDeleted?: boolean = false;
  public readonly typeOfCardEnum?: TypeOfCardEnum;

  constructor(partial: Partial<GetCardWithCriteriaRequest>) {
    Object.assign(this, partial);
  }
}
