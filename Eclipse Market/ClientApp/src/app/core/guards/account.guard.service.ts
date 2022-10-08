import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";


@Injectable({
    providedIn: 'root'
})
export class AccountGuardService implements CanActivate {

    constructor(private router:Router, 
                private jwtHelper: JwtHelperService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = localStorage.getItem('token');

        if (token && !this.jwtHelper.isTokenExpired(token)){
            return true;
        }
        
        this.router.navigate(['/auth']);
        return false;
    }
}