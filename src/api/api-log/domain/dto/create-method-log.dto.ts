export class CreateMethodLogDto {
  module: string;
  method: string;
  body: string;

  constructor(partial: Partial<CreateMethodLogDto>) {
    Object.assign(this, partial);
  }
}
