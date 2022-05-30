export interface IUser {
    Id?: string;
    FirstName: string;
    LastName: string;
    UserName: string;
    Email: string;
    Password: string;
    PhoneNumber: string;
    CurrentListings?: string[];
    FavouriteListings?: string[];
    RoleId: number;
    Role: string;
}
export interface IUserResponse {
    FirstName: string;
    LastName: string;
    UserName: string;
    Email: string;
    Password: string;
    PhoneNumber: string;
    CurrentListings?: string[];
    FavouriteListings?: string[];
    RoleId: number;
}