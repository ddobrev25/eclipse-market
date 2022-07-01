import { Injectable } from "@angular/core";
import { IRoles } from "../_models/role.model";
import { IUsers } from "../_models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    accounts?: IUsers;
    roles?: IRoles;
}