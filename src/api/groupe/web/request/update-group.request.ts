export class UpdateGroupRequest {
  constructor(partial: Partial<UpdateGroupRequest>) {
    Object.assign(this, partial);
  }

  public readonly name: string;
}
