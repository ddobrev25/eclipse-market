import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { IUser } from "../_models/user.model";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class AccountService implements OnDestroy {
    accountInfo: IUser | undefined;
    infoSubscription: Subscription | undefined;

    constructor(private userService: UserService) {
        this.onGetInfo();
    }

    onGetInfo() {
        this.infoSubscription = this.userService.getInfo().subscribe({
            next: (response: any) => {
              this.accountInfo = response;
            }
        });
    }
    ngOnDestroy() {
        this.infoSubscription?.unsubscribe();
    }
}