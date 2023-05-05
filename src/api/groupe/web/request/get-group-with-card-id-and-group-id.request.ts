import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetGroupWithCardIdAndGroupIdRequest {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  groupId: string;
}
