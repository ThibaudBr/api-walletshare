import { GetUserWithCriteriaDto } from '../../domain/dto/get-user-with-criteria.dto';

export class GetUserWithCriteriaQuery {
  constructor(public readonly getUserWithCriteriaDto: GetUserWithCriteriaDto) {}
}
