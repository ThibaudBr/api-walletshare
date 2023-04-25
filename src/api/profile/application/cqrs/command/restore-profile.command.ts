export class RestoreProfileCommand {
  constructor(partial: Partial<RestoreProfileCommand>) {
    Object.assign(this, partial);
  }

  public readonly profileId: string;
}
