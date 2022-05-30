import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AccountsComponent } from "../accounts/accounts.component";
import { AccountsService } from "../_services/accounts.service";

@Injectable({
    providedIn: 'root'
})
export class AccountGuardService implements CanActivate {

    constructor(private router:Router, 
                private accountService: AccountsService,
                private route: ActivatedRoute,
                private accComponent: AccountsComponent) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let isLoggedIn = localStorage.getItem('token') ? true : false;
        console.log(isLoggedIn);
        if (isLoggedIn){
            this.router.navigate(['/account/1003']);
            return false
        }
        // this.router.navigate(['/auth']);
        return true;

    }
}