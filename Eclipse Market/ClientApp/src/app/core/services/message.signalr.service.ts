import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageSignalrService {
  hubConnection?: signalR.HubConnection;
  url: string = 'http://localhost:5001/chatHub';

  startConnection = () => {
    const token = localStorage.getItem('token');
    const jwt = token !== null ? JSON.parse(token) : '';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url, {
        accessTokenFactory: () => jwt,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection
      .start()
      .catch((err: any) => console.log(err));
  };

  MessageAddListener(): void {
    this.hubConnection?.on('MessageAddResponse', (newMessage: Message) => {
      console.log('new message', newMessage);
    });
  }
  MessageEditListener(): void {
    this.hubConnection?.on('MessageEditResponse', (newMessage: Message) => {
      console.log('new edited message', newMessage);
    });
  }
  MessageDeleteListener(): void {
    this.hubConnection?.on(
      'MessageDeleteResponse',
      (deletedMessageId: number) => {
        console.log('deleted message', deletedMessageId);
      }
    );
  }
}
