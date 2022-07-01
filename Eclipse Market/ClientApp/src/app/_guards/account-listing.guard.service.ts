import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserService } from "../_services/user.service";

@Injectable({
    providedIn: 'root'
})
export class AccountListingsGuardService implements CanActivate {

    constructor(private router:Router, 
                private jwtHelper: JwtHelperService,
                private userService: UserService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.userService.loggedUser) {
            this.router.navigate(['/account/info']);
            return false;
        }
        return true;
    }
}