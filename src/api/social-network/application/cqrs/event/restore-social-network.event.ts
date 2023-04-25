export class RestoreSocialNetworkEvent {
  public readonly module: string = 'social-network';
  public readonly method: string = 'restore-social-network';
  constructor(public readonly id: string) {}
}
