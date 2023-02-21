export type BidGetAllResponse = {
    id: number;
    amount: number;
    timeCreated: string;
    auctionId: number;
    userName: string;
}[];
export type BidCreateRequest = {
    amount: number;
    auctionId: number;
}