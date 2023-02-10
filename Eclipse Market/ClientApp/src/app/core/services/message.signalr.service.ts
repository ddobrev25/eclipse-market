import { Injectable } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from "@angular/router";
import * as signalR from "@microsoft/signalr";
import { create } from "lodash";
import { MessageService } from "primeng/api";
import { Chat, ChatGetByIdResponse } from "../models/chat.model";
import {
  Chat$,
  Message,
  MessageGetAllByChatIdResponse,
} from "../models/message.model";
import { MessageDataService } from "./store/message.data.service";

@Injectable({
  providedIn: "root",
})
export class MessageSignalrService {
  hubConnection?: signalR.HubConnection;
  private url = 'https://eclipsemarketapi.azurewebsites.net/chatHub';
  // private url = 'http://localhost:5001/chatHub';



  constructor(
    private messageDataService: MessageDataService,
    private messageService: MessageService,
    private router: Router
  ) { }

  startConnection = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
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

  stopConnection = () => {
    this.hubConnection?.stop();
  }

  messageAddListener(): void {
    this.hubConnection?.on("MessageAddResponse", (newMessage: Message) => {
      const newData = {
        primaryMessages: [],
        secondaryMessages: [newMessage],
        combinedMessages: []
      };
      this.messageDataService.setChatMessages(newMessage.chatId, newData)
      this.notifyUser("SEND");
    });
  }
  messageEditListener(): void {
    this.hubConnection?.on("MessageEditResponse", (newMessage: Message) => {
      this.messageDataService.updateMessage(newMessage.chatId, newMessage)
    });
  }
  messageDeleteListener(): void {
    this.hubConnection?.on(
      "MessageDeleteResponse",
      (deletedMessage: Message) => {
        this.messageDataService.removeMessage(deletedMessage.chatId, deletedMessage.id)
      }
    );
  }

  chatCreateListener(): void {
    this.hubConnection?.on(
      "ChatCreateResponse",
      (createdChat: ChatGetByIdResponse) => {
        const newChat: Chat$ = [{
          chatId: createdChat.id,
          topicListingTitle: createdChat.topicListingTitle,
          primaryMessages: null,
          secondaryMessages: null,
          combinedMessages: null
        }]
        console.log('signalrChat response', createdChat, newChat)
        this.messageDataService.setChats(newChat);
      }
    )
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
        life: 33000,
      });
    }
  }
}
type MessageAction = "SEND";
