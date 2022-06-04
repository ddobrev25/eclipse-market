export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    currentListings?: string[];
    favouriteListings?: string[];
    roleId: number;
    role: string;
}
export interface IUserResponse {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    currentListings?: string[];
    favouriteListings?: string[];
    roleId: number;
}