export interface IMessageRequest {
    SenderId: number,
    ReceiverId: number,
    ListingId: number,
    MessageTitle: string,
    MessageBody: string
}
export interface IMessageResponse {
    id: number,
    title: string,
    body: string,
    senderId: number,
    receiverId: number,
    listingId: number
}
export interface IMessage {
    id: number,
    title: string,
    body: string,
    senderId: number,
    receiverId: number,
    listingId: number
}