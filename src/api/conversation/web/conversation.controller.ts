import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConversationService } from '../application/conversation.service';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { SentMessageRequest } from './request/sent-message.request';
import { ConversationEntity } from '../domain/entities/conversation.entity';

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

  @Post('/public/add-message-with-media')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async addMessageWithMedia(
    @Req() requestUser: RequestUser,
    @Body() messageRequest: SentMessageRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.conversationService.addMessageWithMedia(requestUser.user.id, messageRequest, {
      imageBuffer: file.buffer,
      fileName: file.originalname,
    });
  }

  @Get('/admin/get-active-conversation')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getActiveConversation(): Promise<number> {
    return await this.conversationService.getActiveConversation();
  }

  @Get('/admin/get-all-conversation')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllConversation(): Promise<ConversationEntity[]> {
    return await this.conversationService.getAllConversationAdmin();
  }
}
