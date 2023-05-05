export class UpdateGroupRequest {
  public readonly name: string;

  constructor(partial: Partial<UpdateGroupRequest>) {
    Object.assign(this, partial);
  }
}
