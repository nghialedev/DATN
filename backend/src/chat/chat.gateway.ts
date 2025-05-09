import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/message/entities/message.entity';
import { Repository } from 'typeorm';



@WebSocketGateway({cors: true})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>
  ){}
  handleConnection(client: Socket) {
    console.log("connected" + client.id );
  }
  handleDisconnect(client: Socket) {
    console.log("disconnected" + client.id );
  }
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data:{sender: string; text: string}, @ConnectedSocket() client: Socket) {
    console.log(data);
    const message = new Message()
    // message.sender_id = data.sender;
    // message.receiver_id= data.sender;
    // message.message= data.text;
    // message.project_id= 1
    // message.sender= data.sender
    // message.text= data.text
    // console.log(data); 
    // await this.messageRepo.save(message)
    this.server.emit('message', data)
  }
}
