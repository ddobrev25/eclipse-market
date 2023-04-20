import { Message } from "./message.model";

export type ChatGetAllResponse = {
  id: number;
  timeStarted: string;
  topicListingTitle: string;
  messageIds: number[];
  participantsIds: number[];
}[];

export type ChatGetAllByUserIdResponse = ChatGetAllResponse;

export type ChatGetByIdResponse = {
  id: number;
  timeStarted: string;
  topicListingTitle: string;
  messageIds: number[];
  participantsIds: number[];
};

export type ChatCreateRequest = {
  topicListingId: number;
};

export type Chat = {
  chatId: number;
  topicListingTitle: string;
  primaryMessages: Message[] | null;
  secondaryMessages: Message[] | null;
  combinedMessages: Message[] | null;
}
