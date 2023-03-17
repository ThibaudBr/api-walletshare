export class CreateMethodLogDto {
  constructor(partial: Partial<CreateMethodLogDto>) {
    Object.assign(this, partial);
  }
  module: string;
  method: string;
  body: string;
}
