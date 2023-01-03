import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  constructor() {}

  hubConnection!: signalR.HubConnection;

  token: string = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImFkbWluIiwiUm9sZUNsYWltIjpbIkxpc3RpbmdDYXRlZ29yeUFkZENsYWltIiwiTGlzdGluZ0NhdGVnb3J5RGVsZXRlQ2xhaW0iLCJMaXN0aW5nQ2F0ZWdvcnlHZXRDbGFpbSIsIkxpc3RpbmdDYXRlZ29yeVVwZGF0ZUNsYWltIiwiTGlzdGluZ0RlbGV0ZUNsYWltIiwiTGlzdGluZ0dldENsYWltIiwiTGlzdGluZ1VwZGF0ZUNsYWltIiwiUm9sZUFkZENsYWltIiwiUm9sZURlbGV0ZUNsYWltIiwiUm9sZUdldENsYWltIiwiUm9sZVVwZGF0ZUNsYWltIiwiVXNlckRlbGV0ZUNsYWltIiwiVXNlckdldENsYWltIiwiVXNlclVwZGF0ZUNsYWltIl0sImV4cCI6MTY3MzM3NzIyMCwiaXNzIjoiSXNzdWVyIiwiYXVkIjoiQXVkaWVuY2UifQ.Yi2M9a2y_RXP6c8TeHT2F8sMmJ2WqN8lCFY3C478RII";


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

  askServer(message: string) {
    this.hubConnection
      .invoke('AskServer', message)
      .catch((err) => console.log(err));
  }
  askServerListener() {
    this.hubConnection.on("askServerResponse", (sometext) => {
        console.log(sometext);
    })
  }
}