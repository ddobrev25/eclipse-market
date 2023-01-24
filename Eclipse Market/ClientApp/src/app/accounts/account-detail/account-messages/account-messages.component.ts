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
import {
  map,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";
import { Chat, ChatGetAllResponse } from "src/app/core/models/chat.model";
import {
  Chat$,
  Message,
  MessageEditRequest,
  MessageGetAllByChatIdResponse,
  MessageSendRequest,
} from "src/app/core/models/message.model";
import { DeleteRequest } from "src/app/core/models/user.model";
import { ChatService } from "src/app/core/services/http/chat.service";
import { MsgService } from "src/app/core/services/http/message.service";
import { MessageDataService } from "src/app/core/services/store/message.data.service";
import * as _ from "lodash";

@Component({
  selector: "app-account-messages",
  templateUrl: "./account-messages.component.html",
  styleUrls: ["./account-messages.component.scss"],
})
export class AccountMessagesComponent implements OnInit {
  @ViewChild("msgInput") msgInput!: ElementRef;
  @ViewChildren("contextMenu") messageMenu?: QueryList<ElementRef>;
  @ViewChild("editedMessageInput") editedMessageInput?: ElementRef;

  removeEventListener?: () => void;

  isEditMessageDialogVisible: boolean = false;
  selectedMessageForDelete: Message | null = null;

  chatIsSelected: boolean = false;
  chatsChanged: boolean = false;
  selectedChatId?: number;

  private primaryMessages: Message[] = [];
  destroy$: ReplaySubject<void> = new ReplaySubject<void>(1);
  chat$: Observable<Chat$> = new Observable<Chat$>();

  constructor(
    private chatService: ChatService,
    private msgService: MsgService,
    private renderer: Renderer2,
    private messageService: MessageService,
    private messageDataService: MessageDataService
  ) {}

  ngOnInit(): void {
    this.fetchChats();
  }

  private fetchChats() {
    this.chat$ = this.messageDataService.chats.pipe(
      switchMap((x: Chat$ | null) => {
        if (x === null || this.messageDataService.chatsChanged)
          return this.chatService.getAllByUserId().pipe(
            map((x: ChatGetAllResponse) => {
              const chatObj: Chat$ = [];
              x.forEach((chat) => {
                chatObj.push({
                  chatId: chat.id,
                  topicListingTitle: chat.topicListingTitle,
                  primaryMessages: null,
                  secondaryMessages: null,
                  combinedMessages: null,
                });
              });
              this.messageDataService.chatsChanged = true;
              return _.sortBy(chatObj, "chatId");
            })
          );
        return of(x);
      }),
      map((x: Chat$) => {
        x.forEach((chat) => {
          this.msgService
            .getAllByChatId(chat.chatId)
            .pipe(
              takeUntil(this.destroy$),
              tap((x) => {
                this.primaryMessages = _.concat(
                  x.primaryMessages,
                  this.primaryMessages
                );
                this.primaryMessages = _.unionBy(this.primaryMessages, "id");
                chat.primaryMessages = x.primaryMessages;
                chat.secondaryMessages = x.secondaryMessages;
                chat.combinedMessages = this.sortMessages(x);
              })
            )
            .subscribe();
        });
        return x;
      }),
      tap((x) => {
        if (this.messageDataService.chatsChanged)
          this.messageDataService.setChats(x);
      })
    );
  }

  isPrimary(message: Message) {
    if (_.find(this.primaryMessages, message)) return true;
    return false;
  }

  onSelectChat(selectedChatId: number) {
    if (this.selectedChatId === selectedChatId) return;
    this.chatIsSelected = true;
    this.selectedChatId = selectedChatId;
  }

  private sortMessages(x: MessageGetAllByChatIdResponse): Message[] {
    const combinedMessages = [...x.primaryMessages, ...x.secondaryMessages];
    combinedMessages.sort(function (a, b) {
      return new Date(a.timeSent).valueOf() - new Date(b.timeSent).valueOf();
    });
    combinedMessages.reverse();

    combinedMessages.map((x) => {
      x.timeSent = new Date(x.timeSent).toLocaleDateString("en-US", {
        timeZone: "Europe/Sofia",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
      });
    });
    return combinedMessages.reverse();
  }

  onSendMessage() {
    if (this.selectedChatId) {
      if (this.msgInput.nativeElement.value === "") return;
      const body: MessageSendRequest = {
        body: this.msgInput.nativeElement.value,
        chatId: this.selectedChatId,
      };
      this.msgService
        .send(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp: Message) => {
            this.renderer.setProperty(
              this.msgInput.nativeElement,
              "value",
              null
            );
            const newData = {
              primaryMessages: [resp],
              secondaryMessages: [],
              combinedMessages: [],
            };
            this.messageDataService.setChatMessages(
              this.selectedChatId!,
              newData
            );
          },
          error: (err) => console.log(err),
        });
    }
  }

  onDeleteMessage(message: Message) {
    const body: DeleteRequest = {
      id: message.id,
    };
    this.msgService
      .delete(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => console.log(err),
        complete: () => {
          this.messageDataService.removeMessage(message.chatId, message.id);
        },
      });
  }

  onEditMessage() {
    if (!this.selectedMessageForDelete || !this.editedMessageInput) return;

    const body: MessageEditRequest = {
      id: this.selectedMessageForDelete.id,
      newBody: this.editedMessageInput.nativeElement.value,
    };
    this.msgService
      .edit(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => console.log(err),
        complete: () => {
          this.isEditMessageDialogVisible = false;
        },
      });
  }
  onCopyMessage(message: Message) {
    navigator.clipboard.writeText(message.body);
    this.messageService.add({
      key: "br",
      severity: "info",
      detail: "Съобщението е копирано",
      life: 3000,
    });
  }

  onShowMessageContextMenu(event: any, index: number) {
    event.preventDefault();

    const contextMenuEl = this.messageMenu?.get(index);

    const x = event.currentTarget.parentElement.classList.contains("primary")
      ? event.currentTarget.offsetLeft -
        contextMenuEl?.nativeElement.offsetWidth
      : event.currentTarget.offsetLeft + event.currentTarget.offsetWidth;
    const y = event.currentTarget.offsetTop;

    this.renderer.setStyle(
      contextMenuEl?.nativeElement,
      "visibility",
      "visible"
    );
    this.renderer.setStyle(contextMenuEl?.nativeElement, "top", `${y}px`);
    this.renderer.setStyle(contextMenuEl?.nativeElement, "left", `${x}px`);

    this.removeEventListener = this.renderer.listen(
      contextMenuEl?.nativeElement,
      "mouseleave",
      () => {
        this.renderer.setStyle(
          contextMenuEl?.nativeElement,
          "visibility",
          "hidden"
        );
        this.removeEventListener!();
      }
    );
  }

  onToggleEditMessageDialog(messageForDelete: Message, index: number) {
    if (!this.isEditMessageDialogVisible) {
      this.selectedMessageForDelete = messageForDelete;
    }
    this.renderer.setProperty(
      this.editedMessageInput?.nativeElement,
      "value",
      null
    );
    this.isEditMessageDialogVisible = !this.isEditMessageDialogVisible;
  }

  onDeleteChat(chat: Chat) {}

  ngOnDestroy() {
    this.chatIsSelected = false;
    this.destroy$.next();
    this.destroy$.complete();
    if (this.removeEventListener) this.removeEventListener();
  }
}
