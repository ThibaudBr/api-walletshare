import { TypeOfCardEnum } from '../../domain/enum/type-of-card.enum';
import { WhoCanShareCardEnum } from '../../domain/enum/who-can-share-card.enum';
import { WhoCanSeeCardInformationEnum } from '../../domain/enum/who-can-see-card-information.enum';
import { WhoCanCommunicateWithEnum } from '../../domain/enum/who-can-communicate-with.enum';
import { TransferableStatusCardEnum } from '../../domain/enum/transferable-status-card.enum';

export class UpdateCardRequest {
  cardId: string;
  profileId: string;
  socialName?: string;
  isOwnerPro: boolean;
  firstname?: string;
  lastname?: string;
  companyName?: string;
  phones?: string[];
  emails?: string[];
  urls?: string[];
  birthday?: Date;
  notes?: string;
  numberOfShares: number;
  owner: string;
  connectedCardsId?: string[];
  savedById?: string[];
  occupationsId?: string[];
  groupMembershipsId?: string[];
  mediaUrl?: string;
  messagesCount?: number;
  socialNetworkName?: string;
  typeOfCardEnum?: TypeOfCardEnum;
  whoCanShareCardEnum?: WhoCanShareCardEnum[];
  whoCanSeeCardInformationEnum?: WhoCanSeeCardInformationEnum[];
  whoCanCommunicateWithEnum?: WhoCanCommunicateWithEnum[];
  transferableStatusCardEnum?: TransferableStatusCardEnum[];

  constructor(partial: Partial<UpdateCardRequest>) {
    Object.assign(this, partial);
  }
}
