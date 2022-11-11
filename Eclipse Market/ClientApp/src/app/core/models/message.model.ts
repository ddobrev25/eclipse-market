import { IChat } from "./chat.model"

export interface IMessageGetAllByChatId {
    primaryMessages: IMessageResponse[]
    secondaryMessages: IMessageResponse[]
}
export interface IMessageResponse {
    id:number,
    body: string,
    timeSent: string,
    userName: string
}

export interface IMessageSendRequest {
    body: string,
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