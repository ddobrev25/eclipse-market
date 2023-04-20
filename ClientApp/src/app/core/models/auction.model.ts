export type AuctionGetByIdResponse = {
    id: number;
    expireTime: string;
    startingPrice: number;
    bidIncrement: number;
    buyoutPrice: number;
    listingId: number;
    bidIds: number[];
};
export type AuctionGetAllResponse = AuctionGetByIdResponse[];
export type AuctionCreateRequest = {
    listingId: number;
    expireTime: Date;
    startingPrice: number;
    bidIncrementPercentage: number;
    buyoutPrice: number;
}
export type Auction$ = {
    title: string;
    description: string;
    price: number;
    location: string;
    listingCategoryId: number;
    imageBase64Strings: string[];
    listingId: number;
    expireTime: Date;
    startingPrice: number;
    bidIncrementPercentage: number;
    buyoutPrice: number;
}