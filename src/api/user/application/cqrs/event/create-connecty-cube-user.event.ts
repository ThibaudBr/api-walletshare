export class CreateConnectyCubeUserEvent {
  constructor(partial: Partial<CreateConnectyCubeUserEvent>) {
    Object.assign(this, partial);
  }

  public readonly userId: string;
  public readonly connectyCubeId: string;
  public readonly module: string = 'user';
  public readonly method: string = 'create-connecty-cube-user';
}
