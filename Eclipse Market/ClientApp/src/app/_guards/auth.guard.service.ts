import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private router:Router, 
                private jwtHelper: JwtHelperService,
                private messageService: MessageService){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = +localStorage.getItem('userId')!;
        const routeId = +route.params['id'];
        const token = localStorage.getItem('token');
        if(token && !this.jwtHelper.isTokenExpired(token)) {
            if(id === routeId) {
                return true;
            } else {
                this.messageService.add({key: 'tc', severity:'warn', summary: 'Warning', detail: `You don't have access to this page`, life: 3000});
                this.router.navigate(['/home']);
                return false;
            }
        }
        return false;
    }
}