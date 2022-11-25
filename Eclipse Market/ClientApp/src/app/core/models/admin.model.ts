import { ListingCategoryGetAllResponse } from "./listing-category.model";
import { RoleGetAllResponse } from "./role.model";
import { UserGetAllResponse } from "./user.model";

export type AdminData$ = {
    users?: UserGetAllResponse;
    roles?: RoleGetAllResponse;
    listingCategories?: ListingCategoryGetAllResponse;
} | null;

export type AdminData = UserGetAllResponse | RoleGetAllResponse | ListingCategoryGetAllResponse;