export class CreatedGroupResponse {
  public readonly id: string;

  constructor(partial: Partial<CreatedGroupResponse>) {
    Object.assign(this, partial);
  }
}
