import { CreateCompanyDto } from '../../domain/dto/create-company.dto';

export class CreateCompanyRequest {
  public readonly createCompanyDto: CreateCompanyDto;
  public readonly occupationListId?: string[];
  public readonly profileId: string;

  constructor(partial: Partial<CreateCompanyRequest>) {
    Object.assign(this, partial);
  }
}
