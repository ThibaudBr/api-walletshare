export class CreateSocialNetworkEvent {
  public readonly module: string = 'social-network';
  public readonly method: string = 'create-social-network';
  constructor(public readonly id: string) {}
}
