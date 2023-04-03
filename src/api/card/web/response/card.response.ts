import { ProfileResponse } from '../../../profile/domain/response/profile.response';
import { OccupationResponse } from '../../../occupation/web/response/occupation-response';
import { TypeOfCardEnum } from '../../domain/enum/type-of-card.enum';
import { WhoCanShareCardEnum } from '../../domain/enum/who-can-share-card.enum';
import { WhoCanSeeCardInformationEnum } from '../../domain/enum/who-can-see-card-information.enum';
import { WhoCanCommunicateWithEnum } from '../../domain/enum/who-can-communicate-with.enum';
import { TransferableStatusCardEnum } from '../../domain/enum/transferable-status-card.enum';
import { SocialNetworkResponse } from '../../../social-network/web/response/social-network.response';
import { GroupMembershipResponse } from '../../../groupe/web/response/group-membership.response';

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
  phones?: string[];
  emails?: string[];
  urls?: string[];
  birthday?: Date;
  notes?: string;
  numberOfShares: number;
  owner: ProfileResponse;
  connectedCards?: CardResponse[];
  savedBy?: ProfileResponse[];
  occupations?: OccupationResponse[];
  groupMemberships?: GroupMembershipResponse[];
  mediaUrl?: string;
  messagesCount?: number;
  socialNetwork?: SocialNetworkResponse;
  typeOfCardEnum: TypeOfCardEnum;
  whoCanShareCardEnums?: WhoCanShareCardEnum[];
  whoCanSeeCardInformationEnums?: WhoCanSeeCardInformationEnum[];
  whoCanCommunicateWithEnum?: WhoCanCommunicateWithEnum[];
  transferableStatusCardEnum?: TransferableStatusCardEnum[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
