import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Chat$, Message } from "../../models/message.model";

import * as _ from "lodash";

@Injectable({
  providedIn: "root",
})
export class MessageDataService {
  chatsChanged: boolean = false;
  private chat$: BehaviorSubject<Chat$ | null>;

  constructor() {
    this.chat$ = new BehaviorSubject<Chat$ | null>(null);
  }

  get chats() {
    return this.chat$.asObservable();
  }

  setChats(newData: Chat$) {
    this.chatsChanged = false;
    if (this.chat$.value === null) this.chat$.next([...newData]);
    else this.chat$.next([...this.chat$.value, ...newData]);
  }

  setChatMessages(
    chatId: number,
    newData: {
      primaryMessages: Message[];
      secondaryMessages: Message[];
      combinedMessages: Message[];
    }
  ) {
    const oldChatValue = _.find(this.chat$.value, ["chatId", chatId]);
    if (!oldChatValue) return;
    const newChatValue = [
      {
        chatId: chatId,
        topicListingTitle: oldChatValue.topicListingTitle,
        primaryMessages: [
          ...oldChatValue.primaryMessages!,
          ...newData.primaryMessages,
        ],
        secondaryMessages: [
          ...oldChatValue.secondaryMessages!,
          ...newData.secondaryMessages,
        ],
        combinedMessages: [
          ...oldChatValue.combinedMessages!,
          ...newData.combinedMessages,
        ],
      },
    ];

    const oldValue = this.chat$.value?.filter((x) => x.chatId !== chatId);
    if (!oldValue) return;
    this.chatsChanged = false;
    this.chat$.next([...oldValue, ...newChatValue]);
  }

  updateMessage(chatId: number, newMessage: Message) {
    const chat = _.find(this.chat$.value, ["chatId", chatId]);
    if (!chat) return;
    chat?.primaryMessages?.map((x) => {
      if (x.id === newMessage.id) x = newMessage;
      return x;
    });
    chat?.secondaryMessages?.map((x) => {
      if (x.id === newMessage.id) x = newMessage;
      return x;
    });

    const chatsValue = this.chat$.value?.filter((x) => x.chatId !== chatId);
    chatsValue?.push(chat);

    if (chatsValue) this.chat$.next([...chatsValue]);
  }

  removeMessage(chatId: number, messageForDeleteId: number) {
    const chat = _.find(this.chat$.value, ["chatId", chatId]);
    const newChatPrimaryMessages = chat?.primaryMessages?.filter(
      (x) => x.id !== messageForDeleteId
    );

    const chatsValue = this.chat$.value?.filter((x) => x.chatId !== chatId);
    if (!chat || !newChatPrimaryMessages) return;
    chat.primaryMessages = newChatPrimaryMessages;
    chatsValue?.push(chat);
    if (chatsValue) this.chat$.next([...chatsValue]);
  }
}
