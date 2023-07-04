import { TypeOfCardEnum } from '../../../domain/enum/type-of-card.enum';
import { WhoCanShareCardEnum } from '../../../domain/enum/who-can-share-card.enum';
import { WhoCanSeeCardInformationEnum } from '../../../domain/enum/who-can-see-card-information.enum';
import { WhoCanCommunicateWithEnum } from '../../../domain/enum/who-can-communicate-with.enum';
import { TransferableStatusCardEnum } from '../../../domain/enum/transferable-status-card.enum';

export class UpdateCardCommand {
  public readonly cardId: string;
  public readonly profileId: string;
  public readonly typeOfCardEnum: TypeOfCardEnum;
  public readonly socialName?: string;
  public readonly firstname?: string;
  public readonly lastname?: string;
  public readonly email?: string;
  public readonly phone?: string[];
  public readonly companyName?: string;
  public readonly jobTitle?: string;
  public readonly address?: string;
  public readonly url?: string[];
  public readonly birthday?: Date;
  public readonly occupationsId?: string[];
  public readonly whoCanShareCardEnum?: WhoCanShareCardEnum[];
  public readonly whoCanSeeCardInformationEnum?: WhoCanSeeCardInformationEnum[];
  public readonly whoCanCommunicateWithEnum?: WhoCanCommunicateWithEnum[];
  public readonly transferableStatusCardEnum?: TransferableStatusCardEnum[];
  public readonly socialNetworkId?: string;

  constructor(partial: Partial<UpdateCardCommand>) {
    Object.assign(this, partial);
  }
}
