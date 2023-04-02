export class UpdateVCardRequest {
  constructor(partial: Partial<UpdateVCardRequest>) {
    Object.assign(this, partial);
  }

  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email?: string;
  public readonly phone?: string[];
  public readonly companyName?: string;
  public readonly jobTitle?: string;
  public readonly address?: string;
  public readonly url?: string[];
  public readonly birthday?: Date;
  public readonly occupationId?: string;
  public readonly whoCanShareCardEnums?: string[];
  public readonly whoCanSeeCardInformationEnums?: string[];
  public readonly whoCanSendMessagesEnums?: string[];
  public readonly transferableStatusCardEnum?: string[];
}
