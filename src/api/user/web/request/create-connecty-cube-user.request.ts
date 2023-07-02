export class CreateConnectyCubeUserRequest {
  constructor(partial: Partial<CreateConnectyCubeUserRequest>) {
    Object.assign(this, partial);
  }

  public readonly connectyCubeId: string;
  public readonly connectyCubeToken: string;
}
