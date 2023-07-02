export class CreateConnectyCubeUserCommand {
  constructor(partial: Partial<CreateConnectyCubeUserCommand>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly connectyCubeId: string;
  public readonly connectyCubeToken: string;
}
