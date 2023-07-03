export class GetUsernameByConnectyCubeIdQuery {
  constructor(partial: Partial<GetUsernameByConnectyCubeIdQuery>) {
    Object.assign(this, partial);
  }

  public readonly connectyCubeId: string;
}
