export class GetAllConversationByProfilesAndCardQuery {
  public readonly profilesId: string[];

  constructor(partial?: Partial<GetAllConversationByProfilesAndCardQuery>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
