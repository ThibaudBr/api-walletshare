export class UpdateSocialNetworkCardRequest {
  constructor(partial: Partial<UpdateSocialNetworkCardRequest>) {
    Object.assign(this, partial);
  }

  public readonly socialName: string;
  public readonly socialNetworkId: string;
  public readonly whoCanShareCardEnums?: string[];
  public readonly whoCanSeeCardInformationEnums?: string[];
  public readonly whoCanSendMessagesEnums?: string[];
  public readonly transferableStatusCardEnum?: string[];
}
