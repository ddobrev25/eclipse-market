import { Injectable } from "@angular/core";
import { IRoles } from "../models/role.model";
import { IUsers } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    accounts?: IUsers;
    roles?: IRoles;
}