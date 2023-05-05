export class IsProfileOwnerWithUserIsQuery {
  public readonly profileId: string;
  public readonly userId: string;

  constructor(partial: Partial<IsProfileOwnerWithUserIsQuery>) {
    Object.assign(this, partial);
  }
}
