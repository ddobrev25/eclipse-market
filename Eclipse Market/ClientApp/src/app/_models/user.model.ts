
export interface IUserResponse {
    Id: number;
    FirstName: string;
    LastName: string;
    UserName: string;
    Email: string;
    Password: string;
    PhoneNumber: string;
    CurrentListings?: string[];
    BookmarkedListings?: string[];
    Messages?: string[];
    RoleId: number;
}

export type IUser = IUserResponse;
export type IUsers = IUserResponse[];
