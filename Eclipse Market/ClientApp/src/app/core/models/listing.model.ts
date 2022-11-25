// import { AuthorGetResponse } from "./user.model"

// export interface IListing {
//     id: number,
//     title: string,
//     description: string,
//     price: number,
//     location: string,
//     authorId: number,
//     views: number,
//     timesbookmarked: number,
//     listingCategory: string,
//     imageBase64String: string
// }
// export interface IListingAddRequest {
//     title: string,
//     description: string,
//     price: number,
//     location: string,
//     listingCategoryId: number,
//     imageBase64String: string
// }
// export interface IListingGetResponse {
//     id?: number,
//     title: string,
//     description: string,
//     price: number,
//     location: string,
//     authorId: number,
//     views: number,
//     timesbookmarked: number,
//     listingCategory: string,
//     imageBase64String: string
// }
// export interface IListingGetByIdResponse {
//     title: string,
//     description: string,
//     price: number,
//     location: string,
//     author: AuthorGetResponse,
//     views: number,
//     timesbookmarked: number,
//     listingCategory: string,
//     imageBase64String: string

// }
// export interface IListingGetWithoutAuthorResponse {
//     id: number,
//     title: string,
//     description: string,
//     price: number,
//     location: string,
//     views: number,
//     timesbookmarked: number,
//     listingCategory: string
// }
// export interface IListingGetRecommended {
//     listings: IListing[]
// }
// export interface IListingUpdateRequest {
//     id: number,
//     title: string,
//     description: string,
//     price: number,
//     location: string,
//     listingCategory: string
// }

export type ListingGetAllResponse = {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  authorId: number;
  views: number;
  timesBookmarked: number;
  listingCategory: string;
  imageBase64String: string;
}[];

export type ListingGetByIdResponse = {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  authorId: number;
  views: number;
  timesBookmarked: number;
  listingCategory: string;
  imageBase64String: string;
};

export type ListingGetByIdWithAuthorResponse = {
  id?: number;
  title: string;
  description: string;
  price: number;
  location: string;
  author: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateCreated: string;
    listings: {
      id: number;
      title: string;
      description: string;
      price: number;
      location: string;
      views: number;
      timesBookmarked: number;
      listingCategory: string;
      imageBase64String: string;
    }[];
  };
  views: number;
  timesBookmarked: number;
  listingCategory: string;
  imageBase64String: string;
};

export type ListingGetRecommendedResponse = {
  listings: ListingGetAllResponse[];
};

export type ListingAddRequest = {
  title: string;
  description: string;
  price: number;
  location: string;
  listingCategoryId: number;
  primaryImageBase64String: string;
  secondaryImageBase64String: string[];
};

export type ListingUpdateRequest = {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  listingCategoryId: number;
  //primaryImageBase64String: string;
  //secondaryImageBase64String: string[];
};
