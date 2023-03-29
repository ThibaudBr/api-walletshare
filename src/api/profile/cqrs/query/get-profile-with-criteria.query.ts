import { GetProfileWithCriteriaDto } from '../../domain/dto/get-profile-with-criteria.dto';

export class GetProfileWithCriteriaQuery {
  public readonly getProfileWithCriteriaDto: GetProfileWithCriteriaDto;

  constructor(partial: Partial<GetProfileWithCriteriaQuery>) {
    Object.assign(this, partial);
  }
}
