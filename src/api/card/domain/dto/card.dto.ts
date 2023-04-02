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
  ownerId: string;
  connectedCardsId?: string[];
  savedById?: string[];
  occupationsId?: string[];
  groupMembershipsId?: string[];
  mediaUrl?: string;
  messagesCount?: number;
  socialNetworkName?: string;
  typeOfCardEnum?: string;
  whoCanShareCardEnums?: string[];
  whoCanSeeCardInformationEnums?: string[];
  whoCanCommunicateWithEnum?: string[];
  transferableStatusCardEnum?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
