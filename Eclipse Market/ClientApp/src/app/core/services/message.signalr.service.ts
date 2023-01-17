import { Injectable } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from "@angular/router";
import * as signalR from "@microsoft/signalr";
import { MessageService } from "primeng/api";
import {
  Message,
  MessageGetAllByChatIdResponse,
} from "../models/message.model";
import { MessageDataService } from "./store/message.data.service";

@Injectable({
  providedIn: "root",
})
export class MessageSignalrService {
  hubConnection?: signalR.HubConnection;
  url: string = "http://localhost:5001/chatHub";

  constructor(
    private messageDataService: MessageDataService,
    private messageService: MessageService,
    private router: Router
  ) {}

  startConnection = () => {
    const token = localStorage.getItem("token");
    const jwt = token !== null ? JSON.parse(token) : "";

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url, {
        accessTokenFactory: () => jwt,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection.start().catch((err: any) => console.log(err));
  };

  messageAddListener(): void {
    this.hubConnection?.on("MessageAddResponse", (newMessage: Message) => {
      const newData = {
        primaryMessages: [],
        secondaryMessages: [newMessage],
        combinedMessages: []
      };
      this.messageDataService.setChatMessages(newMessage.chatId, newData);
      this.notifyUser("SEND");
    });
  }
  messageEditListener(): void {
    this.hubConnection?.on("MessageEditResponse", (newMessage: Message) => {
      this.messageDataService.updateMessage(newMessage.chatId, newMessage);
    });
  }
  messageDeleteListener(): void {
    this.hubConnection?.on(
      "MessageDeleteResponse",
      (deletedMessage: Message) => {
        this.messageDataService.removeMessage(deletedMessage.chatId, deletedMessage.id);
      }
    );
  }

  private notifyUser(action: MessageAction) {
    if (this.router.url !== "/account/messages") {
      let message;
      switch (action) {
        case "SEND": {
          message = "Имате ново съобщение!";
          break;
        }
        default:
          return;
      }
      this.messageService.add({
        key: "br",
        severity: "info",
        detail: message,
        life: 3000,
      });
    }
  }
}
type MessageAction = "SEND";
