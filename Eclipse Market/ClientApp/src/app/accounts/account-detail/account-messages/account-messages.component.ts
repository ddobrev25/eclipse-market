import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  QueryList,
  ViewChildren,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ChatGetAllByUserIdResponse,
  ChatGetByIdResponse,
} from 'src/app/core/models/chat.model';
import {
  Message,
  MessageGetAllByChatIdResponse,
  MessageSendRequest,
} from 'src/app/core/models/message.model';
import { ChatService } from 'src/app/core/services/http/chat.service';
import { MsgService } from 'src/app/core/services/http/message.service';
import { UserDataService } from 'src/app/core/services/store/user.data.service';

@Component({
  selector: 'app-account-messages',
  templateUrl: './account-messages.component.html',
  styleUrls: ['./account-messages.component.scss'],
})
export class AccountMessagesComponent implements OnInit {
  @ViewChild('msgInput') msgInput!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  @ViewChildren('messageWrapper') msgWrappers!: QueryList<ElementRef>;
  @ViewChildren('messageLine') msgLines!: QueryList<ElementRef>;

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
          console.log(resp);
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

  onDeleteMessage() {
    console.log('inside delete message method')
  }

  onRightClick(event: any, index: number) {
    // event.preventDefault();

    // const newEl = document.createElement('ul');
    // const parentEl = this.msgWrappers.get(index);
    // if (parentEl?.nativeElement.parentElement.children.length >= 2) return;

    // if (this.lastActiveMenuList >= 0 && this.lastActiveMenuList !== index) {
    //   const previuesMenuListEl = this.msgLines.get(this.lastActiveMenuList);
    //   if (previuesMenuListEl?.nativeElement.children.length > 1)
    //     previuesMenuListEl?.nativeElement.removeChild(
    //       previuesMenuListEl.nativeElement.children[1]
    //     );
    //   this.lastActiveMenuList = -1;
    // }

    // newEl.classList.add('message-menu');
    // newEl.innerHTML = `
    // <li class="reply">Отговор <i class="pi pi-reply"></i></li>
    // <li class="copy">Копирай <i class="pi pi-copy"></i></li>
    // <li class="edit">Редактирай <i class="pi pi-pencil"></i></li>
    // <li class="delete" (click)="onDeleteMessage()">Изтрий <i class="pi pi-trash"></i></li>
    // `;

    // if (
    //   this.msgLines.get(index)?.nativeElement.classList.contains('secondary')
    // ) {
    //   const msgWidth =
    //     this.msgLines.get(index)?.nativeElement.children[0].offsetWidth;
    //   newEl.style.top = '0px';
    //   newEl.style.left = `calc(-100% + 140px + ${msgWidth}px)`;
    //   this.removeEventListener = this.renderer.listen(
    //     newEl,
    //     'mouseleave',
    //     this.onMouseLeave
    //   );
    // } else {
    //   const msgWidth =
    //     this.msgLines.get(index)?.nativeElement.children[0].offsetWidth;
    //   newEl.style.top = '0px';
    //   newEl.style.left = `calc(100% - 140px - ${msgWidth}px)`;
    //   this.removeEventListener = this.renderer.listen(
    //     newEl,
    //     'mouseleave',
    //     this.onMouseLeave
    //   );
    // }

    // const msgHeight =
    //   this.msgLines.get(index)?.nativeElement.children[0].offsetHeight;
    // this.renderer.setStyle(
    //   this.msgLines.get(index)?.nativeElement,
    //   'height',
    //   `${msgHeight}px`
    // );

    // this.lastActiveMenuList = index;
    // parentEl?.nativeElement.parentElement.appendChild(newEl);
  }

  onMouseLeave(event: any) {
    const parentEl = event.target.parentElement;
    const childEl = event.target;
    parentEl.removeChild(childEl);
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
