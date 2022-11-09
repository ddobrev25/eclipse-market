import { AuthorGetResponse } from "./user.model"

export interface IListing {
    id: number,
    title: string,
    description: string,
    price: number,
    location: string,
    authorId: number,
    views: number,
    timesbookmarked: number,
    listingCategory: string
}
export interface IListingAddRequest {
    title: string,
    description: string,
    price: number,
    location: string,
    listingCategory: string
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
    listingCategory: string
}
export interface IListingGetByIdResponse {
    title: string,
    description: string,
    price: number,
    location: string,
    author: AuthorGetResponse,
    views: number,
    timesbookmarked: number,
    listingCategory: string
}
export interface IListingGetWithoutAuthorResponse {
    id: number,
    title: string,
    description: string,
    price: number,
    location: string,
    views: number,
    timesbookmarked: number,
    listingCategory: string
}
export interface IListingGetRecommended {
    listings: IListing[]
}
export interface IListingUpdateRequest {
    id: number,
    title: string,
    description: string,
    price: number,
    location: string,
    listingCategory: string
}