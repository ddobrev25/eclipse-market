import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserService } from "../services/http/user.service"; 

@Injectable({
    providedIn: 'root'
})
export class AccountListingsGuardService implements CanActivate {

    constructor(private router:Router,
                private userService: UserService,
                private jwtHelper: JwtHelperService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.isLoggedIn()) {
            this.router.navigate(['/account/info']);
            return false;
        }
        return true;
    }

    isLoggedIn() {
        const token = localStorage.getItem('token');
        if (token && !this.jwtHelper.isTokenExpired(token)) {
            console.log('entered if');
            this.router.navigate(['/account/info']);
            return false;
        }
        return true;
    }
}