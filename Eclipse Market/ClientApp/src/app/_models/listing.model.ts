export interface IListing {
    id: number,
    title: string,
    description: string,
    price: number,
    location: string,
    authorId: number,
    views: number,
    timesbookmarked: number,
    listingCategoryId: number
}
export interface IListingAddRequest {
    title: string,
    description: string,
    price: number,
    location: string,
    listingCategoryId: number
}
export interface IListingGetResponse {
    id?: number,
    title: string,
    description: string,
    price: number,
    location: string,
    authorId: number,
    views: number,
    timesbookmarked: number,
    listingCategoryId: number
}
export interface IListingGetRecommended {
    listings: IListing[]
}