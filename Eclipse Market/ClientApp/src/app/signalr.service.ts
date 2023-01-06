import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { MessageSendRequest } from './core/models/message.model';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  constructor() {}

  hubConnection!: signalR.HubConnection;

token: string = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImFkbWluIiwiUm9sZUNsYWltIjpbIkxpc3RpbmdDYXRlZ29yeUFkZENsYWltIiwiTGlzdGluZ0NhdGVnb3J5RGVsZXRlQ2xhaW0iLCJMaXN0aW5nQ2F0ZWdvcnlHZXRDbGFpbSIsIkxpc3RpbmdEZWxldGVDbGFpbSIsIkxpc3RpbmdHZXRDbGFpbSIsIkxpc3RpbmdVcGRhdGVDbGFpbSIsIlJvbGVBZGRDbGFpbSIsIlJvbGVEZWxldGVDbGFpbSIsIlJvbGVHZXRDbGFpbSIsIlJvbGVVcGRhdGVDbGFpbSIsIlVzZXJEZWxldGVDbGFpbSIsIlVzZXJHZXRDbGFpbSIsIlVzZXJVcGRhdGVDbGFpbSJdLCJleHAiOjE2NzM1OTE4MDUsImlzcyI6Iklzc3VlciIsImF1ZCI6IkF1ZGllbmNlIn0.tu7vmA6KK3yR6c2yC285ttWrHEIPIrqqZC6M5k_ntCs"

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5001/chatHub',  {
        accessTokenFactory: () => this.token,
        
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Hub connection started!');
      })
      .catch((err) => console.log(`Error while starting connectionL ` + err));
  };

askServer(message: MessageSendRequest) {
    this.hubConnection
      .invoke('Send', message)
      .catch((err) => console.log(err));
  }
  askServerListener() {
    this.hubConnection.on("SendMessageResponse", (sometext) => {
        console.log(sometext);
    })
  }
}