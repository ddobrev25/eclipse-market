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
