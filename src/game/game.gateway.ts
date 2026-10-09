import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly game: GameService) {}

  handleConnection(client: Socket) {
    const cube = this.game.spawn(client.id);
    client.emit('init', { myId: client.id, world: this.game.getWorld() });
    client.broadcast.emit('cube:joined', cube);
  }

  handleDisconnect(client: Socket) {
    this.game.despawn(client.id);
    this.server.emit('cube:left', { id: client.id });
  }

  @SubscribeMessage('input')
  handleInput(@ConnectedSocket() client: Socket, @MessageBody() key: string) {
    const updated = this.game.applyInput(client.id, key);
    if (!updated) return;
    this.server.emit('cube:moved', updated);
  }
}
