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
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationService } from '../../../notification/application/notification.service';
import { EventBus } from '@nestjs/cqrs';
import { ErrorCustomEvent } from '../../../../util/exception/error-handler/error-custom.event';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private isFirstTime: boolean;

  constructor(
    private readonly conversationService: ConversationService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly eventBus: EventBus,
  ) {
    this.isFirstTime = true;
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

      const conversationEntities: ConversationEntity[] =
        await this.conversationService.getAllConversationByProfilesAndCard(user.profiles);

      const uniqueConversationEntities = new Set<ConversationEntity>(conversationEntities);

      for (const conversationEntity of uniqueConversationEntities) {
        for (const profileEntity of user.profiles) {
          const cardOneOwnerId = conversationEntity.connectedCard?.cardEntityOne.owner.id;
          const cardTwoOwnerId = conversationEntity.connectedCard?.cardEntityTwo.owner.id;
          const groupMembersIds = conversationEntity.group?.members.map(member => member.card.owner.id) ?? [];

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
            this.server.to(socket.id).emit('conversations', createJoinConversationDto.conversationEntity);
          }
        }
      }
    } catch (e) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'ChatGateway.handleConnection',
          handler: 'ChatGateway',
          error: e.message,
        }),
      );
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
          this.server.to(socket.id).emit('conversations', createJoinConversationDto.conversationEntity);
        }
      }
    }
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() sentMessage: SentMessageRequest,
    @ConnectedSocket() socket: Socket,
  ): Promise<ReceiveMessageResponse> {
    try {
      const user: UserEntity = await this.conversationService.getUserAndProfilesFromSocket(socket.id);
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
        conversationId: conversation.id,
        content: message.content,
        author: {
          ...author,
        },
      });

      for (const joinedProfile of conversation.joinedProfiles) {
        this.server.to(joinedProfile.socketId).emit('receive_message', messageResponse);
      }

      return messageResponse;
    } catch (e) {
      await this.disconnect(socket);
      throw new BadRequestException();
    }
  }

  @SubscribeMessage('join_conversation')
  async onJoinConversation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() joinConversationRequest: JoinConversationRequest,
  ): Promise<void> {
    const user: UserEntity = await this.conversationService.getUserAndProfilesFromSocket(socket.id);
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
        conversationId: conversation.id,
        content: message.content,
        author: {
          ...message.author,
        },
      });
    });
    this.server.to(socket.id).emit('send_all_messages', messageResponses);
  }

  @SubscribeMessage('sdp-offer')
  async handleSdpOffer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conversationId: string; offer: RTCSessionDescriptionInit },
  ): Promise<void> {
    try {
      const conversation = await this.conversationService.getConversationById(payload.conversationId);
      if (!conversation) {
        throw new BadRequestException('Conversation not found');
      }

      if (!conversation.joinedProfiles.find(p => p.socketId === socket.id)) {
        throw new BadRequestException('User is not part of the conversation');
      }
      const otherParticipants = conversation.joinedProfiles.filter(p => p.socketId !== socket.id);
      for (const participant of otherParticipants) {
        this.server.to(participant.socketId).emit('sdp-offer', { offer: payload.offer, senderSocketId: socket.id });
        try {
          await this.notificationService.createNotificationWhenCalled(participant.profile.user.id, conversation.id);
        } catch (e) {
          return;
        }
      }
    } catch (e) {
      await this.disconnect(socket);
      throw e;
    }
  }

  @SubscribeMessage('sdp-answer')
  async handleSdpAnswer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { senderSocketId: string; answer: RTCSessionDescriptionInit },
  ): Promise<void> {
    try {
      this.server.to(payload.senderSocketId).emit('sdp-answer', { answer: payload.answer });
    } catch (e) {
      await this.disconnect(socket);
      throw e;
    }
  }

  @SubscribeMessage('ice-candidate')
  async handleIceCandidate(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conversationId: string; candidate: RTCIceCandidateInit },
  ): Promise<void> {
    try {
      const conversation = await this.conversationService.getConversationById(payload.conversationId);
      if (!conversation) {
        throw new BadRequestException('Conversation not found');
      }

      if (!conversation.joinedProfiles.find(p => p.socketId === socket.id)) {
        throw new BadRequestException('User is not part of the conversation');
      }
      const otherParticipants = conversation.joinedProfiles.filter(p => p.socketId !== socket.id);
      for (const participant of otherParticipants) {
        this.server.to(participant.socketId).emit('ice-candidate', { candidate: payload.candidate });
      }
    } catch (e) {
      await this.disconnect(socket);
      throw e;
    }
  }

  @SubscribeMessage('call-rejected')
  async handleCallRejected(socket: Socket, payload: { senderSocketId: string }): Promise<void> {
    try {
      const sender = await this.conversationService.getUserAndProfilesFromSocket(payload.senderSocketId);
      if (!sender) {
        throw new BadRequestException('User not found');
      }
      this.server.to(payload.senderSocketId).emit('call-rejected', { rejectedBySocketId: socket.id });
    } catch (e) {
      await this.disconnect(socket);
      throw e;
    }
  }
}
