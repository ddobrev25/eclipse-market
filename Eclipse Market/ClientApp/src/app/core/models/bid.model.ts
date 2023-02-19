export type BidGetAllResponse = {
    id: number;
    amount: number;
    timeCreated: string;
    auctionId: number;
    userId: number;
}[];
export type BidCreateRequest = {
    amount: number;
    auctionId: number;
}