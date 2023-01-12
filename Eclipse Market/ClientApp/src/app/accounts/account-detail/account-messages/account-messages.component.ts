import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  QueryList,
  ViewChildren,
  Renderer2,
} from "@angular/core";
import { Subscription } from "rxjs";
import {
  ChatGetAllByUserIdResponse,
  ChatGetByIdResponse,
} from "src/app/core/models/chat.model";
import {
  Message,
  MessageGetAllByChatIdResponse,
  MessageSendRequest,
} from "src/app/core/models/message.model";
import { ChatService } from "src/app/core/services/http/chat.service";
import { MsgService } from "src/app/core/services/http/message.service";
import { UserDataService } from "src/app/core/services/store/user.data.service";

@Component({
  selector: "app-account-messages",
  templateUrl: "./account-messages.component.html",
  styleUrls: ["./account-messages.component.scss"],
})
export class AccountMessagesComponent implements OnInit {
  @ViewChild("msgInput") msgInput!: ElementRef;
  @ViewChild("container") container!: ElementRef;
  @ViewChildren("messageWrapper") msgWrappers!: QueryList<ElementRef>;
  @ViewChildren("messageLine") msgLines!: QueryList<ElementRef>;

  @ViewChildren("t") test?: QueryList<ElementRef>;

  removeEventListener?: () => void;

  lastActiveMenuList: number = -1;
  fetchSubs?: Subscription;
  fetchChatsSubs?: Subscription;
  messageSubs?: Subscription;
  sendMessageSubs?: Subscription;

  chatIsSelected: boolean = false;
  chats: ChatGetAllByUserIdResponse = [];
  selectedChat?: ChatGetByIdResponse;

  primaryMessages?: Message[];
  secondaryMessages?: Message[];
  combinedMessages?: Message[];

  constructor(
    private userDataService: UserDataService,
    private chatService: ChatService,
    private msgService: MsgService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.fetchChats();
  }

  fetchChats() {
    this.fetchChatsSubs = this.userDataService.userData.subscribe({
      next: (data) => {
        if (data && data.chats) {
          this.chats = data.chats;
          return;
        } else {
          this.fetchSubs = this.chatService.getAllByUserId().subscribe({
            next: (resp: ChatGetAllByUserIdResponse) => {
              const tempBody = {
                chats: resp,
              };
              this.userDataService.setUserData(tempBody);
              this.chats = resp;
            },
            error: (err) => console.log(err),
          });
        }
      },
      error: (err) => console.log(err),
    });
  }

  separateMessage(message: Message): boolean {
    if (this.primaryMessages?.includes(message)) {
      return true;
    }
    return false;
  }

  onSelectChat(selectedChat: ChatGetByIdResponse) {
    this.chatIsSelected = true;
    this.selectedChat = selectedChat;
    this.messageSubs = this.msgService
      .getAllByChatId(this.selectedChat.id)
      .subscribe({
        next: (resp: MessageGetAllByChatIdResponse) => {
          this.primaryMessages = resp.primaryMessages;
          this.secondaryMessages = resp.secondaryMessages;
          this.combinedMessages = [
            ...this.primaryMessages,
            ...this.secondaryMessages,
          ];
          this.combinedMessages.sort(function (a, b) {
            return a.timeSent.localeCompare(b.timeSent);
          });
          this.combinedMessages.reverse();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  onSendMessage() {
    if (this.selectedChat) {
      const body: MessageSendRequest = {
        body: this.msgInput.nativeElement.value,
        chatId: this.selectedChat.id,
      };
      this.sendMessageSubs = this.msgService.send(body).subscribe({
        next: (resp: any) => {
          this.msgInput.nativeElement.value = null;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  onDeleteMessage(message: Message) {
    console.log("inside delete message method");
  }

  onRightClick(event: any, index: number, message: Message) {
    event.preventDefault();

    const contextMenuEl = this.test?.get(index);

    const x = event.currentTarget.parentElement.classList.contains("primary")
      ? event.currentTarget.offsetLeft - contextMenuEl?.nativeElement.offsetWidth
      : event.currentTarget.offsetLeft + event.currentTarget.offsetWidth;
    const y = event.currentTarget.offsetTop;

    this.renderer.setStyle(contextMenuEl?.nativeElement, "visibility", "visible");
    this.renderer.setStyle(contextMenuEl?.nativeElement, "top", `${y}px`);
    this.renderer.setStyle(contextMenuEl?.nativeElement, "left", `${x}px`);

    this.renderer.listen(contextMenuEl?.nativeElement, "mouseleave", () => {
      this.renderer.setStyle(contextMenuEl?.nativeElement, "visibility", "hidden")
    })
  }

  ngOnDestroy() {
    this.chatIsSelected = false;
    this.fetchSubs?.unsubscribe();
    this.fetchChatsSubs?.unsubscribe();
    this.messageSubs?.unsubscribe();
    this.sendMessageSubs?.unsubscribe();
    if (this.removeEventListener) this.removeEventListener();
  }
}
