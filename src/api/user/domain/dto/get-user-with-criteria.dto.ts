export class GetUserWithCriteriaDto {
  public readonly createdFrom?: Date;
  public readonly createdTo?: Date;

  public readonly updatedFrom?: Date;
  public readonly updatedTo?: Date;

  public readonly deletedFrom?: Date;
  public readonly deletedTo?: Date;
  public readonly isDeleted?: boolean;

  public readonly role?: string;

  public readonly username?: string;
  public readonly mail?: string;

  constructor(partial: Partial<GetUserWithCriteriaDto>) {
    Object.assign(this, partial);
  }
}
