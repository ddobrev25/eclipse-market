import { ListingCategoryGetAllResponse } from "./listing-category.model";
import { RoleGetAllResponse } from "./role.model";
import { UserGetAllResponse } from "./user.model";

export type AdminDataUsers$ = UserGetAllResponse | null;
export type AdminDataRoles$ = RoleGetAllResponse | null;
export type AdminDataCategories$ = ListingCategoryGetAllResponse | null;
