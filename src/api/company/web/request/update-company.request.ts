import { UpdateCompanyDto } from '../../domain/dto/update-company.dto';

export class UpdateCompanyRequest {
  public readonly id: string;
  public readonly updateCompanyDto?: UpdateCompanyDto;
  public readonly occupationListId?: string[];
  public readonly profileId?: string;

  constructor(partial: Partial<UpdateCompanyRequest>) {
    Object.assign(this, partial);
  }
}
