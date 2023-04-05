import { GroupRequestStatusEnum } from '../../domain/enum/group-request-status.enum';

export class CancelGroupRequestCommand {
  constructor(partial: Partial<CancelGroupRequestCommand>) {
    Object.assign(this, partial);
  }

  public readonly cardId: string;
  public readonly groupId: string;
  public readonly status: GroupRequestStatusEnum;
}
