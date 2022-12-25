import { ChatGetAllByUserIdResponse, ChatGetAllResponse } from "./chat.model";
import { ListingGetAllResponse } from "./listing.model";

export type DeleteRequest = {
  id: number;
};

export type User = {
  id?: number;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  roleName?: string;
  dateTimeCreated?: string;
  currentListings?: ListingGetAllResponse;
  bookmarkedListings?: ListingGetAllResponse;
  imageBase64String?: string;
  chats?: ChatGetAllResponse
};

export type User$ = {
  id?: number;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  roleName?: string;
  dateTimeCreated?: string;
  currentListings?: ListingGetAllResponse;
  bookmarkedListings?: ListingGetAllResponse;
  imageBase64String?: string;
  chats?: ChatGetAllByUserIdResponse | ChatGetAllResponse
} | null;

export type UserGetAllResponse = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  roleName: string;
  dateTimeCreated: string;
  currentListings?: ListingGetAllResponse;
  bookmarkedListings?: ListingGetAllResponse;
  imageBase64String: string;
}[];

export type UserGetInfoResponse = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  imageBase64String: string;
};

export type UserRegisterRequest = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  roleId: number;
  imageBase64String: string;
};

export type UserLoginRequest = {
  userName: string;
  password: string;
};

export type UserLoginResponse = {
  token: string;
  claims: string[];
};

export type UserUpdateRequest = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  roleId: number;
  imageBase64String: string;
};

export type UserChangePassword = {
  currentPassword: string;
  newPassword: string;
};
export type UserUpdateImageRequest  = {
  newImageBase64String: string;
}
export type AuthorGetResponse = {
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
}
export type BookmarkListingRequest = {
  listingId: number;
}
export type UnBookmarkListingRequest = {
  listingId: number;
}