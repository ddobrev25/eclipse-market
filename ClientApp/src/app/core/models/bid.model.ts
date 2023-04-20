export type BidGetAllResponse = Bid[];
export type BidCreateRequest = {
    amount: number;
    auctionId: number;
}
export type Bid$ = Bid[] | null;
export type Bid = {
    id: number;
    amount: number;
    timeCreated: string;
    auctionId: number;
    userName: string;
}