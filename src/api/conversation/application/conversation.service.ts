import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Socket } from 'socket.io';
import { MessageEntity } from '../domain/entities/message.entity';
import { CardEntity } from '../../card/domain/entities/card.entity';
import { ConversationEntity } from '../domain/entities/conversation.entity';
import { GetMessageFromConversationRequest } from '../web/request/get-message-from-conversation.request';
import { CreateJoinConversationDto } from '../domain/dto/create-join-conversation.dto';
import { UserEntity } from '../../user/domain/entities/user.entity';
import { ProfileEntity } from '../../profile/domain/entities/profile.entity';

@Injectable()
export class ConversationService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async saveMessage(content: string, author: CardEntity, conversation: ConversationEntity): Promise<MessageEntity> {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }

  async saveJoinedConversation(socketId: string, createJoinConversationDto: CreateJoinConversationDto) {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }

  async deleteJoinedConversationWithSocketId(socketId: string): Promise<void> {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }

  async deletedJoinedConversation(socketId: string): Promise<void> {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }

  async deletedAllJoinedConversation(): Promise<void> {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }

  async removeMessageFromConversation(messageId: string): Promise<void> {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }

  async softRemoveMessageFromConversation(messageId: string, userId: string): Promise<void> {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }

  async getConversationWhereUserConnected(
    socketId: string,
    getMessageFromConversationRequest: GetMessageFromConversationRequest,
  ): Promise<ConversationEntity> {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }

  async getConversationById(conversationId: string): Promise<ConversationEntity> {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }

  async getCardById(user: UserEntity, cardId: string): Promise<CardEntity> {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }

  async getUserAndProfilesFromSocket(socket: Socket): Promise<UserEntity> {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }

  async getAllConversationByProfilesAndCard(profiles: ProfileEntity[]): Promise<CreateJoinConversationDto[]> {
    // TODO: Implement this method
    throw new Error('Not implemented');
  }
}
