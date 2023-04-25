import { GetOccupationWithCriteriaDto } from '../../domain/dto/get-occupation-with-criteria.dto';

export class GetOccupationWithCriteriaQuery {
  constructor(partial: Partial<GetOccupationWithCriteriaQuery>) {
    Object.assign(this, partial);
  }
  public readonly criteria: GetOccupationWithCriteriaDto;
}
