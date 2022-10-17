import { IChat } from "./chat.model"

export interface IMessageSendRequest {
    body: string,
    senderId: number,
    chatId: number
}
export interface IMessageEditRequest {
    id: number,
    newBody: string
}
export interface IMessage {
    id: number,
    body: string,
    timeSent: string,
    senderId: number,
    chatId: number,
    chat: IChat
}