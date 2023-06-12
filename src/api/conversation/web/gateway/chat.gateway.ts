import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from '../../application/conversation.service';
import { ReceiveMessageResponse } from '../response/receive-message.response';
import { SentMessageRequest } from '../request/sent-message.request';
import { MessageEntity } from '../../domain/entities/message.entity';
import { CardEntity } from '../../../card/domain/entities/card.entity';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { JoinConversationRequest } from '../request/join-conversation.request';
import { CreateJoinConversationDto } from '../../domain/dto/create-join-conversation.dto';
import { GetMessageFromConversationRequest } from '../request/get-message-from-conversation.request';
import { AuthService } from '../../../auth/application/auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private isFirstTime: boolean;

  constructor(private readonly conversationService: ConversationService, private readonly authService: AuthService) {
    this.isFirstTime = true;
  }

  // listen for send_message events
  @SubscribeMessage('send_message_test')
  listenForMessagesTest(@MessageBody() message: string): void {
    this.server.sockets.emit('receive_message', message);
  }

  async handleConnection(socket: Socket): Promise<void> {
    try {
      if (this.isFirstTime) {
        await this.conversationService.deletedAllJoinedConversation();
        await this.conversationService.deletedAllConnectedUser();
        this.isFirstTime = false;
      }

      let token: string;
      if (socket.handshake.headers.authorization) {
        token = socket.handshake.headers.authorization;
      } else {
        token = socket.handshake.auth.token;
      }

      const user: UserEntity = await this.authService.getUserEntityFromAuthToken(token.split(' ')[1]).catch(e => {
        throw new HttpException('No credentials set', HttpStatus.UNAUTHORIZED);
      });
      socket.data.user = user;
      if (!user) {
        return await this.disconnect(socket);
      }
      if (user.connection) {
        await this.conversationService.removeConnectedUser(user.connection.socketId);
      }
      await this.conversationService.createConnectedUser({
        socketId: socket.id,
        user: user,
      });

      const conversationEntities: ConversationEntity[] =
        await this.conversationService.getAllConversationByProfilesAndCard(user.profiles);

      for (const conversationEntity of conversationEntities) {
        for (const profileEntity of user.profiles) {
          const cardOneOwnerId = conversationEntity.connectedCard?.cardEntityOne.owner.id;
          const cardTwoOwnerId = conversationEntity.connectedCard?.cardEntityTwo.owner.id;
          const groupMembersIds = conversationEntity.group?.members.map(member => member.card.owner.id);

          if (
            cardOneOwnerId === profileEntity.id ||
            cardTwoOwnerId === profileEntity.id ||
            groupMembersIds.includes(profileEntity.id)
          ) {
            const createJoinConversationDto: CreateJoinConversationDto = new CreateJoinConversationDto({
              conversationEntity: conversationEntity,
              profileEntity: profileEntity,
              userId: user.id,
            });
            await this.conversationService.saveJoinedConversation(socket.id, createJoinConversationDto);
            this.server.emit('conversations', createJoinConversationDto.conversationEntity);
          }
        }
      }
    } catch (e) {
      await this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    await this.disconnect(socket);
  }

  async disconnect(socket: Socket): Promise<void> {
    await this.conversationService.removeConnectedUser(socket.id);
    await this.conversationService.deletedJoinedConversation(socket.id);
    socket.disconnect();
  }

  @SubscribeMessage('get_my_conversations')
  async getMyConversation(@ConnectedSocket() socket: Socket): Promise<void> {
    let token: string;
    if (socket.handshake.headers.authorization) {
      token = socket.handshake.headers.authorization;
    } else {
      token = socket.handshake.auth.token;
    }

    const user: UserEntity = await this.authService.getUserEntityFromAuthToken(token.split(' ')[1]).catch(e => {
      throw new HttpException('No credentials set', HttpStatus.UNAUTHORIZED);
    });
    socket.data.user = user;
    if (!user) {
      return await this.disconnect(socket);
    }
    if (user.connection) {
      await this.conversationService.removeConnectedUser(user.connection.socketId);
    }
    await this.conversationService.createConnectedUser({
      socketId: socket.id,
      user: user,
    });

    const conversationEntities: ConversationEntity[] =
      await this.conversationService.getAllConversationByProfilesAndCard(user.profiles);

    for (const conversationEntity of conversationEntities) {
      for (const profileEntity of user.profiles) {
        const cardOneOwnerId = conversationEntity.connectedCard?.cardEntityOne.owner.id;
        const cardTwoOwnerId = conversationEntity.connectedCard?.cardEntityTwo.owner.id;
        const groupMembersIds = conversationEntity.group?.members.map(member => member.card.owner.id);

        if (
          cardOneOwnerId === profileEntity.id ||
          cardTwoOwnerId === profileEntity.id ||
          groupMembersIds.includes(profileEntity.id)
        ) {
          const createJoinConversationDto: CreateJoinConversationDto = new CreateJoinConversationDto({
            conversationEntity: conversationEntity,
            profileEntity: profileEntity,
            userId: user.id,
          });
          await this.conversationService.saveJoinedConversation(socket.id, createJoinConversationDto);
          this.server.emit('conversations', createJoinConversationDto.conversationEntity);
        }
      }
    }
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() sentMessage: SentMessageRequest,
    @ConnectedSocket() socket: Socket,
  ): Promise<ReceiveMessageResponse> {
    const user: UserEntity = await this.conversationService.getUserAndProfilesFromSocket(socket);
    const author: CardEntity = await this.conversationService.getCardById(user, sentMessage.cardId);
    const conversation: ConversationEntity = await this.conversationService.getConversationById(
      sentMessage.conversationId,
    );
    const message: MessageEntity = await this.conversationService.saveMessage(
      sentMessage.content,
      author,
      conversation,
    );

    const messageResponse: ReceiveMessageResponse = new ReceiveMessageResponse({
      content: message.content,
      author: {
        ...author,
      },
    });
    this.server.sockets.emit('receive_message', messageResponse);

    return messageResponse;
  }

  @SubscribeMessage('join_conversation')
  async onJoinConversation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() joinConversationRequest: JoinConversationRequest,
  ): Promise<void> {
    const user: UserEntity = await this.conversationService.getUserAndProfilesFromSocket(socket);
    const author: CardEntity = await this.conversationService.getCardById(user, joinConversationRequest.cardId);
    const conversation: ConversationEntity = await this.conversationService.getConversationById(
      joinConversationRequest.conversationId,
    );

    const createJoinConversationDto: CreateJoinConversationDto = new CreateJoinConversationDto({
      conversationEntity: conversation,
      profileEntity: author.owner,
      userId: user.id,
    });
    await this.conversationService.saveJoinedConversation(socket.id, createJoinConversationDto);
  }

  @SubscribeMessage('leave_conversation')
  async onLeaveConversation(@ConnectedSocket() socket: Socket): Promise<void> {
    await this.conversationService.deleteJoinedConversationWithSocketId(socket.id);
  }

  @SubscribeMessage('request_messages_from_conversation')
  async requestAllMessages(
    @ConnectedSocket() socket: Socket,
    @MessageBody() getMessageFromConversationRequest: GetMessageFromConversationRequest,
  ): Promise<void> {
    const conversation: ConversationEntity = await this.conversationService.getConversationWhereUserConnected(
      socket.id,
      getMessageFromConversationRequest,
    );

    const messageResponses: ReceiveMessageResponse[] = conversation.messages.map((message: MessageEntity) => {
      return new ReceiveMessageResponse({
        content: message.content,
        author: {
          ...message.author,
        },
      });
    });
    socket.emit('send_all_messages', messageResponses);
  }
}
