import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../services/user.service"; 

@Injectable({
    providedIn: 'root'
})
export class AccountListingsGuardService implements CanActivate {

    constructor(private router:Router,
                private userService: UserService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.userService.loggedUser) {
            this.router.navigate(['/account/info']);
            return false;
        }
        return true;
    }
}