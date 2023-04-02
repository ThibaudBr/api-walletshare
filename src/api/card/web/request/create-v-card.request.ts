import { TypeOfCardEnum } from "../../domain/enum/type-of-card.enum";
import { WhoCanShareCardEnum } from "../../domain/enum/who-can-share-card.enum";
import { WhoCanSeeCardInformationEnum } from "../../domain/enum/who-can-see-card-information.enum";
import { WhoCanCommunicateWithEnum } from "../../domain/enum/who-can-communicate-with.enum";
import { TransferableStatusCardEnum } from "../../domain/enum/transferable-status-card.enum";

export class CreateVCardRequest {
  constructor(partial: Partial<CreateVCardRequest>) {
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
  public readonly typeOfCardEnum?: string[] = [TypeOfCardEnum.V_CARD];
  public readonly whoCanShareCardEnums?: string[] = [WhoCanShareCardEnum.DIFFUSIBLE];
  public readonly whoCanSeeCardInformationEnums?: string[] = [WhoCanSeeCardInformationEnum.ALL];
  public readonly whoCanSendMessagesEnums?: string[] = [WhoCanCommunicateWithEnum.ALL];
  public readonly transferableStatusCardEnum?: string[] = [TransferableStatusCardEnum.IS_NOT_TRANSFERABLE];
}
