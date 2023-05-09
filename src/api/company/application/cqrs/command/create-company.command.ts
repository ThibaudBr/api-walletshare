import { CreateCompanyDto } from '../../../domain/dto/create-company.dto';

export class CreateCompanyCommand {
  public readonly profileId: string;
  public readonly createCompanyDto: CreateCompanyDto;
  public readonly occupationIdList?: string[];

  constructor(partial: Partial<CreateCompanyCommand>) {
    Object.assign(this, partial);
  }
}
