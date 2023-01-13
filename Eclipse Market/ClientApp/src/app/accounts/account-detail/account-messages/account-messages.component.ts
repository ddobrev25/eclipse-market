import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  QueryList,
  ViewChildren,
  Renderer2,
} from "@angular/core";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import {
  ChatGetAllByUserIdResponse,
  ChatGetByIdResponse,
} from "src/app/core/models/chat.model";
import {
  Message,
  MessageEditRequest,
  MessageGetAllByChatIdResponse,
  MessageSendRequest,
} from "src/app/core/models/message.model";
import { DeleteRequest } from "src/app/core/models/user.model";
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
  @ViewChildren("contextMenu") messageMenu?: QueryList<ElementRef>;

  removeEventListener?: () => void;

  lastActiveMenuList: number = -1;
  fetchSubs?: Subscription;
  fetchChatsSubs?: Subscription;
  messageSubs?: Subscription;
  sendMessageSubs?: Subscription;
  deleteMessageSubs?: Subscription;
  editMessageSubs?: Subscription;

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
    private renderer: Renderer2,
    private messageService: MessageService
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
    const body: DeleteRequest = {
      id: message.id
    }
    this.deleteMessageSubs = this.msgService.delete(body).subscribe({
      error: err => console.log(err)
    })
  }
  onEditMessage(message: Message) {
    const body: MessageEditRequest = {
      id: message.id,
      newBody: "need to add"
    }
    this.editMessageSubs = this.msgService.edit(body).subscribe({
      error: err => console.log(err),
      complete: () => {}
    })
  }
  onCopyMessage(message: Message) {
    navigator.clipboard.writeText('text to be copied');
  }


  onShowMessageContextMenu(event: any, index: number) {
    event.preventDefault();

    const contextMenuEl = this.messageMenu?.get(index);

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
