export interface IUserGetOneResponse {
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
export interface IUserGetAllResponse {
    id: number;
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