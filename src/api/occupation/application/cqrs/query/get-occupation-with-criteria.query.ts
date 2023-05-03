import { GetOccupationWithCriteriaDto } from '../../../domain/dto/get-occupation-with-criteria.dto';

export class GetOccupationWithCriteriaQuery {
  public readonly criteria: GetOccupationWithCriteriaDto;

  constructor(partial: Partial<GetOccupationWithCriteriaQuery>) {
    Object.assign(this, partial);
  }
}
