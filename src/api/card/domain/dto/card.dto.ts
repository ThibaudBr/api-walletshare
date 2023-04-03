import { TypeOfCardEnum } from '../enum/type-of-card.enum';
import { WhoCanShareCardEnum } from '../enum/who-can-share-card.enum';
import { WhoCanSeeCardInformationEnum } from '../enum/who-can-see-card-information.enum';
import { WhoCanCommunicateWithEnum } from '../enum/who-can-communicate-with.enum';
import { TransferableStatusCardEnum } from '../enum/transferable-status-card.enum';

export class CardDto {
  constructor(partial: Partial<CardDto>) {
    Object.assign(this, partial);
  }

  id: string;
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
  whoCanShareCardEnums?: WhoCanShareCardEnum[];
  whoCanSeeCardInformationEnums?: WhoCanSeeCardInformationEnum[];
  whoCanCommunicateWithEnum?: WhoCanCommunicateWithEnum[];
  transferableStatusCardEnum?: TransferableStatusCardEnum[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
