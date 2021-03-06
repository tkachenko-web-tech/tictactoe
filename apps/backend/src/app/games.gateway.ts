import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { AppService } from './app.service';
import { Server, Socket } from 'socket.io';
import { STATE } from '@tictactoe/game';
import { WS_PORT } from '@tictactoe/config';

@WebSocketGateway(WS_PORT, { transports: ['websocket'], origins: ['*'] })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  constructor(
    private readonly appService: AppService
  ) {
  }

  @SubscribeMessage('msg')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    data = JSON.parse(data);
    const { eventType } = data;
    if (eventType === 'JOIN') {
      const { gameId, playerId } = data;
      client.join(gameId);
      client.to(gameId).emit(JSON.stringify({ eventType: 'JOIN', playerId }));
    } else if (eventType === 'TURN') {
      const { gameId, squareNumber, playerId } = data;

      if (this.appService.isGameStarted(gameId)) {
        client.emit(JSON.stringify({ evenType: 'GAME_NOT_STARTED' }));
        return;
      }

      if (!this.appService.isPlayerNext(gameId, playerId))
        return;

      const game = this.appService.makeTurn(gameId, squareNumber);
      if (game.state !== STATE.NOT_FINISHED) {
        this.server.to(data.gameId).emit(JSON.stringify({
          eventType: 'FINISH',
          game
        }));
        return;
      }

      const next = this.appService.next(game.id);
      this.server.to(data.gameId).emit(JSON.stringify({ eventType: 'TURN', game }));
    }
  }

  handleConnection(client: Socket): any {
    console.log(`Client ${client.id} connected to ${client.rooms}.`);
  }

  handleDisconnect(client: Socket): any {
    Object.keys(client.rooms).forEach(key => {
      this.server.to(client.rooms[key]).emit('msg', JSON.stringify({
        eventType: 'DISCONNECT'
      }))
    })
    console.log(`Client ${client.id} disconnected from ${client.rooms}.`);
  }

}
