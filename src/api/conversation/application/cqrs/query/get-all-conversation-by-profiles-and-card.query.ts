export class GetAllConversationByProfilesAndCardQuery {
  constructor(partial?: Partial<GetAllConversationByProfilesAndCardQuery>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  public readonly profilesId: string[];
}
