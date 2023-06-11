import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Socket } from 'socket.io';
import { MessageEntity } from '../domain/entities/message.entity';
import { CardEntity } from '../../card/domain/entities/card.entity';
import { ConversationEntity } from '../domain/entities/conversation.entity';
import { GetMessageFromConversationRequest } from '../web/request/get-message-from-conversation.request';
import { CreateJoinConversationDto } from '../domain/dto/create-join-conversation.dto';
import { UserEntity } from '../../user/domain/entities/user.entity';
import { ProfileEntity } from '../../profile/domain/entities/profile.entity';
import { SentMessageRequest } from '../web/request/sent-message.request';
import { NewMediaDto } from '../../media/domain/dto/new-media.dto';
import { UploadMediaCommand } from '../../media/application/cqrs/command/upload-media.command';
import { RemoveMediaCommand } from '../../media/application/cqrs/command/remove-media.command';
import { InvalidIdHttpException } from '../../../util/exception/custom-http-exception/invalid-id.http-exception';
import { AddMessageWithMediaCommand } from './cqrs/command/add-message-with-media.command';
import { MessageResponse } from '../web/response/message.response';
import { CreateConversationMessageCommand } from './cqrs/command/create-conversation-message.command';
import { CreateJoinedConversationCommand } from './cqrs/command/create-joined-conversation.command';
import { DeleteJoinedConversationWithSocketIdCommand } from './cqrs/command/delete-joined-conversation-with-socket-id.command';
import { DeleteAllJoinedConversationCommand } from './cqrs/command/delete-all-joined-conversation.command';
import { RemoveMessageConversationCommand } from './cqrs/command/remove-message-conversation.command';
import { IsUserIdOwnerOfMessageQuery } from './cqrs/query/is-user-id-owner-of-message.query';
import { GetConversationByIdQuery } from './cqrs/query/get-conversation-by-id.query';
import { GetCardByIdForConversationQuery } from './cqrs/query/get-card-by-id-for-conversation.query';
import { GetUserAndProfileFromSocketQuery } from './cqrs/query/get-user-and-profile-from-socket.query';
import { GetAllConversationByProfilesAndCardQuery } from './cqrs/query/get-all-conversation-by-profiles-and-card.query';
import { GetMessageFromConversationQuery } from './cqrs/query/get-message-from-conversation.query';
import { SoftRemoveMessageConversationCommand } from './cqrs/command/soft-remove-message-conversation.command';
import { RemoveAllJoinedConversationWithSocketIdCommand } from './cqrs/command/remove-all-joined-conversation-with-socket-id.command';
import { GetActiveConversationCountQuery } from './cqrs/query/get-active-conversation-count.query';
import { RemoveAllConnectedUserCommand } from './cqrs/command/remove-all-connected-user.command';
import { CreateConnectedUserCommand } from './cqrs/command/create-connected-user.command';
import { RemoveConnectedUserBySocketIdCommand } from './cqrs/command/remove-connected-user-by-socket-id.command';

@Injectable()
export class ConversationService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async saveMessage(content: string, author: CardEntity, conversation: ConversationEntity): Promise<MessageEntity> {
    return await this.commandBus
      .execute(
        new CreateConversationMessageCommand({
          cardId: author.id,
          conversationId: conversation.id,
          content: content,
        }),
      )
      .catch(async error => {
        if (error.message === 'Card not found') throw new InvalidIdHttpException('Card not found');
        if (error.message === 'Conversation not found') throw new InvalidIdHttpException('Conversation not found');
        throw new Error(error);
      });
  }

  async saveJoinedConversation(socketId: string, createJoinConversationDto: CreateJoinConversationDto): Promise<void> {
    await this.commandBus
      .execute(
        new CreateJoinedConversationCommand({
          socketId: socketId,
          conversationEntity: createJoinConversationDto.conversationEntity,
          userId: createJoinConversationDto.userId,
          profileEntity: createJoinConversationDto.profileEntity,
        }),
      )
      .catch(async error => {
        if (error.message === 'Card not found') throw new InvalidIdHttpException('Card not found');
        if (error.message === 'Conversation not found') throw new InvalidIdHttpException('Conversation not found');
        if (error.message === 'Profile not found') throw new InvalidIdHttpException('Profile not found');
        throw new Error(error);
      });
  }

  async deleteJoinedConversationWithSocketId(socketId: string): Promise<void> {
    await this.commandBus
      .execute(
        new DeleteJoinedConversationWithSocketIdCommand({
          socketId: socketId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Joined conversation not found')
          throw new InvalidIdHttpException('Joined conversation not found');
        throw new Error(error);
      });
  }

  async deletedJoinedConversation(socketId: string): Promise<void> {
    await this.commandBus
      .execute(
        new RemoveAllJoinedConversationWithSocketIdCommand({
          socketId: socketId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Joined conversation not found')
          throw new InvalidIdHttpException('Joined conversation not found');
        throw new Error(error);
      });
  }

  async deletedAllJoinedConversation(): Promise<void> {
    await this.commandBus.execute(new DeleteAllJoinedConversationCommand()).catch(async error => {
      throw new Error(error);
    });
  }

  async removeMessageFromConversation(messageId: string): Promise<void> {
    await this.commandBus
      .execute(
        new RemoveMessageConversationCommand({
          messageId: messageId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Message not found') throw new InvalidIdHttpException('Message not found');
        throw new Error(error);
      });
  }

  async softRemoveMessageFromConversation(messageId: string, userId: string): Promise<void> {
    await this.commandBus
      .execute(
        new SoftRemoveMessageConversationCommand({
          messageId: messageId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Message not found') throw new InvalidIdHttpException('Message not found');
        throw new Error(error);
      });
  }

  async getConversationWhereUserConnected(
    socketId: string,
    getMessageFromConversationRequest: GetMessageFromConversationRequest,
  ): Promise<ConversationEntity> {
    return await this.queryBus
      .execute(
        new GetMessageFromConversationQuery({
          conversationId: getMessageFromConversationRequest.conversationId,
          nbMessage: getMessageFromConversationRequest.nbMessage,
          skip: getMessageFromConversationRequest.skip,
        }),
      )
      .catch(async error => {
        if (error.message === 'Conversation not found') throw new InvalidIdHttpException('Conversation not found');
        throw new Error(error);
      });
  }

  async getConversationById(conversationId: string): Promise<ConversationEntity> {
    return await this.queryBus
      .execute(
        new GetConversationByIdQuery({
          conversationId: conversationId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Conversation not found') throw new InvalidIdHttpException('Conversation not found');
        throw new Error(error);
      });
  }

  async getCardById(user: UserEntity, cardId: string): Promise<CardEntity> {
    return await this.queryBus
      .execute(
        new GetCardByIdForConversationQuery({
          cardId: cardId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Card not found') throw new InvalidIdHttpException('Card not found');
        throw new Error(error);
      });
  }

  async getUserAndProfilesFromSocket(socket: Socket): Promise<UserEntity> {
    return await this.queryBus
      .execute(
        new GetUserAndProfileFromSocketQuery({
          socketId: socket.id,
        }),
      )
      .catch(async error => {
        if (error.message === 'User not found') throw new InvalidIdHttpException('User not found');
        throw new Error(error);
      });
  }

  async getAllConversationByProfilesAndCard(profiles: ProfileEntity[]): Promise<ConversationEntity[]> {
    return await this.queryBus
      .execute(
        new GetAllConversationByProfilesAndCardQuery({
          profilesId: profiles.map(profile => profile.id),
        }),
      )
      .catch(async error => {
        if (error.message === 'Conversation not found') throw new InvalidIdHttpException('Conversation not found');
        throw new Error(error);
      });
  }

  async addMessageWithMedia(
    userId: string,
    messageRequest: SentMessageRequest,
    newMediaDto: NewMediaDto,
  ): Promise<MessageResponse> {
    const newMedia = await this.commandBus
      .execute(
        new UploadMediaCommand({
          dataBuffer: newMediaDto.imageBuffer,
          filename: newMediaDto.fileName,
        }),
      )
      .catch(async error => {
        if (error.message === 'File is too big') throw new BadRequestException('File is too big');
        throw error;
      });

    return await this.commandBus
      .execute(
        new AddMessageWithMediaCommand({
          cardId: messageRequest.cardId,
          conversationId: messageRequest.conversationId,
          content: messageRequest.content,
          media: newMedia,
        }),
      )
      .catch(async error => {
        await this.commandBus.execute(new RemoveMediaCommand({ mediaId: newMedia.id }));
        if (error.message === 'Card not found') throw new InvalidIdHttpException('Card not found');
        if (error.message === 'Conversation not found') throw new InvalidIdHttpException('Conversation not found');
        throw error;
      })
      .then(async message => {
        return new MessageResponse({
          ...message,
        });
      });
  }

  async isUserIdOwnerOfMessage(userId: string, messageId: string): Promise<boolean> {
    return await this.queryBus
      .execute(new IsUserIdOwnerOfMessageQuery({ userId: userId, messageId: messageId }))
      .catch(async error => {
        if (error.message === 'Message not found') throw new InvalidIdHttpException('Message not found');
        if (error.message === 'User not found') throw new InvalidIdHttpException('User not found');
        throw new Error(error);
      });
  }

  async getActiveConversation(): Promise<number> {
    return await this.queryBus.execute(new GetActiveConversationCountQuery()).catch(async error => {
      if (error.message === 'Conversation not found') throw new InvalidIdHttpException('Conversation not found');
      throw new Error(error);
    });
  }

  async createConnectedUser(param: { socketId: string; user: UserEntity }): Promise<void> {
    return await this.commandBus
      .execute(
        new CreateConnectedUserCommand({
          socketId: param.socketId,
          user: param.user,
        }),
      )
      .catch(async error => {
        if (error.message === 'Error while creating connected user')
          throw new InternalServerErrorException('Error while creating connected user');
        throw new Error(error);
      });
  }

  async removeConnectedUser(socketId: string): Promise<void> {
    return await this.commandBus
      .execute(
        new RemoveConnectedUserBySocketIdCommand({
          socketId: socketId,
        }),
      )
      .catch(async error => {
        if (error.message === 'Error while removing connected user')
          throw new InternalServerErrorException('Error while removing connected user');
        throw new Error(error);
      });
  }

  async deletedAllConnectedUser(): Promise<void> {
    return await this.commandBus.execute(new RemoveAllConnectedUserCommand()).catch(async error => {
      if (error.message === 'Error while removing all connected user')
        throw new InternalServerErrorException('Error while removing all connected user');
    });
  }
}
