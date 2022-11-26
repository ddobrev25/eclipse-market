import { ChatGetAllResponse } from "./chat.model";
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
  //currentListings?: IListing[];
  //bookmarkedListings?: IListing[];
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
  chats?: ChatGetAllResponse
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
  //currentListings?: IListing[];
  //bookmarkedListings?: IListing[];
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
