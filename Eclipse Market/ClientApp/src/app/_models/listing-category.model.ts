export interface IListingCategoryResponse {
    id: number,
    title: string
}
export interface IListingCategoryAddRequest {
    Title: string
}
export interface IListingCategoryUpdateRequest {
    id: number,
    title: string
}
export interface IListingCategoryDeleteRequest {
    Id: number
}
export type IListingCategories = IListingCategoryResponse[];
export type IListingCategory = IListingCategoryResponse;