import { UpdateCompanyDto } from '../../../domain/dto/update-company.dto';

export class UpdateCompanyCommand {
  public readonly companyId: string;
  public readonly updateCompanyDto?: UpdateCompanyDto;
  public readonly newProfileOwnerId?: string;
  public readonly updateOccupationIdList?: string[];

  constructor(partial: Partial<UpdateCompanyCommand>) {
    Object.assign(this, partial);
  }
}
