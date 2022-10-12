import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private jwtHelper: JwtHelperService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('entered guard');

    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
        console.log('entered if');
        this.router.navigate(['/account/info']);
        return false;
    }

    this.router.navigate(['/auth']);
    return false;
  }
  
}
