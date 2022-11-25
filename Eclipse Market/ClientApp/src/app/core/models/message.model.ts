export type Message = {
  id: number;
  body: string;
  timeSent: string;
  userName: string;
};

export type MessageGetAllByChatIdResponse = {
  primaryMessages: Message[];
  secondaryMessages: Message[];
};

export type MessageSendRequest = {
  body: string;
  chatId: number;
}

export type MessageEditRequest = {
  id: number;
  newBody: string;
};
