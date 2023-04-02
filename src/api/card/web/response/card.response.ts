export class CardResponse {
  constructor(partial: Partial<CardResponse>) {
    Object.assign(this, partial);
  }

  id: string;
  socialName?: string;
  isOwnerPro: boolean;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phones: string[];
  emails: string[];
  urls?: string[];
  birthday?: Date;
  notes?: string;
  occupation?: string;
  numberOfShares: number;
  owner: string;
  connectedCards: string[];
  savedBy: string[];
  occupations: string[];
  groupMemberships: string[];
  mediaUrl?: string;
  messagesCount: number;
  socialNetworkName?: string;
  typeOfCardEnum: string;
  whoCanShareCardEnums: string[];
  whoCanSeeCardInformationEnums: string[];
  whoCanCommunicateWithEnum: string[];
  transferableStatusCardEnum: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

}
