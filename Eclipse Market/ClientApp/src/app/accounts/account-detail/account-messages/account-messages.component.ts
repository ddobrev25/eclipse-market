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
import {
  ChatGetAllResponse,
  ChatGetByIdResponse,
} from "src/app/core/models/chat.model";
import {
  Message,
  Message$,
  MessageEditRequest,
  MessageGetAllByChatIdResponse,
  MessageSendRequest,
} from "src/app/core/models/message.model";
import { DeleteRequest } from "src/app/core/models/user.model";
import { ChatService } from "src/app/core/services/http/chat.service";
import { MsgService } from "src/app/core/services/http/message.service";
import { MessageDataService } from "src/app/core/services/store/message.data.service";
import { UserDataService } from "src/app/core/services/store/user.data.service";

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
  selectedChat?: ChatGetByIdResponse;

  private primaryMessages: Message[] = [];
  message$: Observable<Message$> = new Observable<Message$>();
  destroy$: ReplaySubject<void> = new ReplaySubject<void>(1);
  chat$: Observable<ChatGetAllResponse> = new Observable<ChatGetAllResponse>();

  constructor(
    private userDataService: UserDataService,
    private chatService: ChatService,
    private msgService: MsgService,
    private renderer: Renderer2,
    private messageService: MessageService,
    private messageDataService: MessageDataService
  ) {}

  ngOnInit(): void {
    this.fetchChats();
  }

  private updateChatsInDataService(newChats: ChatGetAllResponse) {
    const newData = {
      chats: newChats,
    };
    this.chatsChanged = false;
    this.userDataService.setUserData(newData);
  }

  private fetchChats() {
    this.chat$ = this.userDataService.userData.pipe(
      switchMap((x) => {
        return x?.chats
          ? of(x.chats)
          : this.chatService
              .getAllByUserId()
              .pipe(tap((x) => (this.chatsChanged = true)));
      }),
      tap((x) => {
        if (this.chatsChanged) this.updateChatsInDataService(x);
      })
    );
  }

  isPrimary(message: Message) {
    if (this.primaryMessages.includes(message)) return true;
    return false;
  }

  private fetchMessagesByChat(selectedChatId: number) {
    this.message$ = this.messageDataService.userMessages.pipe(
      switchMap((x) => {
        return x === null
          ? this.fetchMessagesByChatFromService(selectedChatId)
          : of(x);
      }),
      map((x) => {
        const cbMessages = {
          combinedMessages: this.sortMessages(x),
        };
        cbMessages.combinedMessages.filter(x => x.chatId === selectedChatId);
        return cbMessages;
      })
    );
  }

  private fetchMessagesByChatFromService(selectedChatId: number) {
    return this.msgService.getAllByChatId(selectedChatId).pipe(
      tap((x) => {
        this.fetchMessagesByChat(selectedChatId);
        this.messageDataService.setUserMessages(x);
      }),
      takeUntil(this.destroy$)
    );
  }
  
  onSelectChat(selectedChat: ChatGetByIdResponse) {
    if(this.selectedChat?.id === selectedChat.id) return;
    this.messageDataService.setUserMessages(
      { primaryMessages: [], secondaryMessages: [] },
      true
    );
    this.chatIsSelected = true;
    this.selectedChat = selectedChat;
    this.fetchMessagesByChatFromService(selectedChat.id).subscribe();
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

    this.primaryMessages = x.primaryMessages;
    return combinedMessages;
  }


  onSendMessage() {
    if (this.selectedChat) {
      if (this.msgInput.nativeElement.value === "") return;
      const body: MessageSendRequest = {
        body: this.msgInput.nativeElement.value,
        chatId: this.selectedChat.id,
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
            const newData: MessageGetAllByChatIdResponse = {
              primaryMessages: [resp],
              secondaryMessages: [],
            };
            this.messageDataService.setUserMessages(newData);
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
          this.messageDataService.removeSenderMesage(message.id);
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

  ngOnDestroy() {
    this.chatIsSelected = false;
    this.destroy$.next();
    this.destroy$.complete();
    if (this.removeEventListener) this.removeEventListener();
    this.messageDataService.setUserMessages(
      { primaryMessages: [], secondaryMessages: [] },
      true
    );
  }
}
