import { IMessage } from "./message.model"
import { IUser } from "./user.model"

export interface IChatGetAllResponse {
    id: number,
    timeStarted: string,
    topicListingId: number,
    messageIds: number[],
    participantIds: number[]
}
export interface IChatGetByIdResponse {
    timeStarted: string,
    topicListingId: number,
    messageIds: number[],
    participantIds: number[]
}
export interface IChatCreateRequest {
    topicListingId: number
}
export interface IChat {
    id: number,
    timeStarted: string,
    topicListingId: number,
    messages: IMessage[],
    participants: UserChat[]
}
interface UserChat {
    userId: number,
    user: IUser,
    chatId: number,
    chat: IChat
}