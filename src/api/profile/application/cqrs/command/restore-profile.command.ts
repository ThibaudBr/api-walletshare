export class RestoreProfileCommand {
  public readonly profileId: string;

  constructor(partial: Partial<RestoreProfileCommand>) {
    Object.assign(this, partial);
  }
}
