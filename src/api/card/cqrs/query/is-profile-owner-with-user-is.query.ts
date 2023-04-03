export class IsProfileOwnerWithUserIsQuery {
  constructor(partial: Partial<IsProfileOwnerWithUserIsQuery>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
  public readonly userId: string;
}
