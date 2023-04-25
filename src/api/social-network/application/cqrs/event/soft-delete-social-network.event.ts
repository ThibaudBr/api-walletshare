export class SoftDeleteSocialNetworkEvent {
  public readonly module: string = 'social-network';
  public readonly method: string = 'soft-delete-social-network';
  constructor(public readonly id: string) {}
}
