import { TypeOfCardEnum } from '../../domain/enum/type-of-card.enum';

export class GetCardWithCriteriaRequest {
  constructor(partial: Partial<GetCardWithCriteriaRequest>) {
    Object.assign(this, partial);
  }

  public readonly isDeleted?: boolean = false;

  public readonly typeOfCardEnum?: TypeOfCardEnum;
}
