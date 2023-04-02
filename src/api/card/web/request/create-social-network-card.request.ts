import { TypeOfCardEnum } from '../../domain/enum/type-of-card.enum';
import { WhoCanShareCardEnum } from '../../domain/enum/who-can-share-card.enum';
import { WhoCanSeeCardInformationEnum } from '../../domain/enum/who-can-see-card-information.enum';
import { WhoCanCommunicateWithEnum } from '../../domain/enum/who-can-communicate-with.enum';
import { TransferableStatusCardEnum } from '../../domain/enum/transferable-status-card.enum';

export class CreateSocialNetworkCardRequest {
  constructor(partial: Partial<CreateSocialNetworkCardRequest>) {
    Object.assign(this, partial);
  }

  public readonly socialName: string;
  public readonly socialNetworkId: string;
  public readonly typeOfCardEnum?: string[] = [TypeOfCardEnum.SOCIAL_NETWORK];
  public readonly whoCanShareCardEnums?: string[] = [WhoCanShareCardEnum.DIFFUSIBLE];
  public readonly whoCanSeeCardInformationEnums?: string[] = [WhoCanSeeCardInformationEnum.ALL];
  public readonly whoCanSendMessagesEnums?: string[] = [WhoCanCommunicateWithEnum.ALL];
  public readonly transferableStatusCardEnum?: string[] = [TransferableStatusCardEnum.IS_NOT_TRANSFERABLE];
}
