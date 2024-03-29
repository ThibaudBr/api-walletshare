import { TypeOfCardEnum } from '../../domain/enum/type-of-card.enum';
import { WhoCanShareCardEnum } from '../../domain/enum/who-can-share-card.enum';
import { WhoCanSeeCardInformationEnum } from '../../domain/enum/who-can-see-card-information.enum';
import { WhoCanCommunicateWithEnum } from '../../domain/enum/who-can-communicate-with.enum';
import { TransferableStatusCardEnum } from '../../domain/enum/transferable-status-card.enum';

export class CreateCardRequest {
  typeOfCardEnum: TypeOfCardEnum;
  socialName?: string;
  isOwnerPro: boolean;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phones?: string[];
  emails?: string[];
  urls?: string[];
  birthday?: Date;
  notes?: string;
  ownerId: string;
  connectedCardsId?: string[];
  savedById?: string[];
  occupationsId?: string[];
  groupMembershipsId?: string[];
  mediaUrl?: string;
  messagesCount?: number;
  whoCanShareCardEnum?: WhoCanShareCardEnum[];
  whoCanSeeCardInformationEnum?: WhoCanSeeCardInformationEnum[];
  whoCanCommunicateWithEnum?: WhoCanCommunicateWithEnum[];
  transferableStatusCardEnum?: TransferableStatusCardEnum[];
  socialNetworkId?: string;
  presetId?: string;

  constructor(partial: Partial<CreateCardRequest>) {
    Object.assign(this, partial);
  }
}
