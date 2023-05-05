export class DeleteSocialNetworkEvent {
  public readonly module: string = 'social-network';
  public readonly method: string = 'delete-social-network';

  constructor(public readonly id: string) {}
}
