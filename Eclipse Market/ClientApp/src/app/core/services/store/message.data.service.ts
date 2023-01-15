import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  Chat$,
  Message,
  MessageGetAllByChatIdResponse,
} from "../../models/message.model";

@Injectable({
  providedIn: "root",
})
export class MessageDataService {
  private userMessages$: BehaviorSubject<MessageGetAllByChatIdResponse | null>;
  constructor() {
    this.userMessages$ =
      new BehaviorSubject<MessageGetAllByChatIdResponse | null>(null);
    this.chat$ = new BehaviorSubject<Chat$ | null>(null);
  }

  get userMessages() {
    return this.userMessages$.asObservable();
  }

  setUserMessages(newData: MessageGetAllByChatIdResponse, reset = false) {
    if (reset) {
      this.userMessages$.next(null);
      return;
    }
    let newValue;
    if (this.userMessages$.value) {
      newValue = {
        primaryMessages: [
          ...this.userMessages$.value.primaryMessages,
          ...newData.primaryMessages,
        ],
        secondaryMessages: [
          ...this.userMessages$.value.secondaryMessages,
          ...newData.secondaryMessages,
        ],
      };
    } else {
      newValue = {
        primaryMessages: [...newData.primaryMessages],
        secondaryMessages: [...newData.secondaryMessages],
      };
    }
    this.userMessages$.next(newValue);
  }

  updateUserMessages(newMessage: Message) {
    const newPrimaryMessages = this.userMessages$.value?.primaryMessages.map(
      (x) => {
        if (x.id === newMessage.id) {
          x = newMessage;
        }
        return x;
      }
    );
    const newSecondaryMessages =
      this.userMessages$.value?.secondaryMessages.map((x) => {
        if (x.id === newMessage.id) {
          x = newMessage;
        }
        return x;
      });
    this.userMessages$.next({
      primaryMessages: newPrimaryMessages!,
      secondaryMessages: newSecondaryMessages!,
    });
  }

  removeMessage(messageForDeleteId: number) {
    let newValue;
    const newSecondaryMessages =
      this.userMessages$.value?.secondaryMessages.filter(
        (x) => x.id !== messageForDeleteId
      );
    if (newSecondaryMessages && this.userMessages$.value?.secondaryMessages) {
      newValue = {
        primaryMessages: [...this.userMessages$.value.primaryMessages],
        secondaryMessages: [...newSecondaryMessages],
      };
    }
    if (newValue) {
      this.userMessages$.next(newValue);
    }
  }

  removeSenderMesage(messageForDeleteId: number) {
    let newValue;
    const newPrimaryMessages = this.userMessages$.value?.primaryMessages.filter(
      (x) => x.id !== messageForDeleteId
    );
    if (newPrimaryMessages && this.userMessages$.value?.secondaryMessages) {
      newValue = {
        primaryMessages: [...newPrimaryMessages],
        secondaryMessages: [...this.userMessages$.value.secondaryMessages],
      };
    }
    if (newValue) {
      this.userMessages$.next(newValue);
    }
  }














private chat$: BehaviorSubject<Chat$ | null>;

get chats() {
  return this.chat$.asObservable();
}

setChats(newData: Chat$) {
  this.chat$.next({...this.chat$.value, ...newData})
}





}
