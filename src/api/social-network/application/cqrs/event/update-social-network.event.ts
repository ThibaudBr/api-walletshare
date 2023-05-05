export class UpdateSocialNetworkEvent {
  public readonly module: string = 'social-network';
  public readonly method: string = 'update-social-network';

  constructor(public readonly id: string) {}
}
