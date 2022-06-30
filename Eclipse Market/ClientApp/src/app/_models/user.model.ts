
export interface IUserResponse {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    currentListings?: string[];
    bookmarkedListings?: string[];
    messages?: string[];
    roleId: number;
    roleName?: string;
}

export type IUser = IUserResponse;
export type IUsers = IUserResponse[];
