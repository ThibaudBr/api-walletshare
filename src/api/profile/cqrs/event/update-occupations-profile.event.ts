
export class UpdateOccupationsProfileEvent {
  public readonly listOfOccupationId: string[];
  public readonly profileId: string;
  public readonly module: string = 'profile';
  public readonly method: string = 'update-occupations-profile';
  constructor(partial: Partial<UpdateOccupationsProfileEvent>) {
    Object.assign(this, partial);
  }
}
