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
} | null;

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
  //currentListings?: IListing[];
  //bookmarkedListings?: IListing[];
  imageBase64String?: string;
} | null;

export type UserSetData$ = {
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
