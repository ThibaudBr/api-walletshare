import { Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConversationService } from '../application/conversation.service';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';

@Controller('conversation')
@ApiTags('Conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Delete('/public/remove-message-conversation/:messageId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async removeMessageFromConversation(
    @Req() requestUser: RequestUser,
    @Param('messageId') messageId: string,
  ): Promise<void> {
    return await this.conversationService.softRemoveMessageFromConversation(requestUser.user.id, messageId);
  }

  @Delete('/admin/remove-message-conversation/:messageId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async removeMessageFromConversationAdmin(@Param('messageId') messageId: string): Promise<void> {
    return await this.conversationService.removeMessageFromConversation(messageId);
  }
}
