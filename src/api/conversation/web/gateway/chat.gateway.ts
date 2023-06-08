import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
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

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private isFirstTime: boolean;

  constructor(private readonly conversationService: ConversationService) {
    this.isFirstTime = true;
  }

  async handleConnection(socket: Socket): Promise<void> {
    if (this.isFirstTime) {
      await this.conversationService.deletedAllJoinedConversation();
    }
    const user: UserEntity = await this.conversationService.getUserAndProfilesFromSocket(socket);

    if (!user) {
      return await this.disconnect(socket);
    }

    const createJoinConversationDtos: CreateJoinConversationDto[] =
      await this.conversationService.getAllConversationByProfilesAndCard(user.profiles);
    for (const createJoinConversationDto of createJoinConversationDtos) {
      await this.conversationService.saveJoinedConversation(socket.id, createJoinConversationDto);
      this.server.emit('conversations', createJoinConversationDto.conversationEntity);
    }
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    await this.disconnect(socket);
  }

  async disconnect(socket: Socket): Promise<void> {
    await this.conversationService.deletedJoinedConversation(socket.id);
    socket.disconnect();
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
