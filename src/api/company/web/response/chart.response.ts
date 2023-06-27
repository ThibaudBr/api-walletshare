export class ChartResponse {
  constructor(partial: ChartResponse) {
    Object.assign(this, partial);
  }

  public readonly y: number;
  public readonly x: string;
}
