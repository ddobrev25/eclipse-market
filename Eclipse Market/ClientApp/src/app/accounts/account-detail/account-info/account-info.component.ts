import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/core/models/user.model';
import { AdminService } from 'src/app/core/services/admin.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  userInfo: IUser | undefined;
  loadUserSubs: Subscription | undefined;

  constructor(private userService: UserService,
              private router: Router,
              private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.userInfo = this.userService.loggedUser;
  }

  loadUserInfo() {
    if(!this.userService.loggedUser) {
      this.loadUserSubs = this.userService.getInfo().subscribe({
        next: (resp: IUser) => {
          this.userService.loggedUser = resp;
          this.userInfo = resp;
        }
      })
    }
  }

  onLogOut() {
    localStorage.clear();
    this.userService.loggedUser = undefined;
    this.adminService.accounts = undefined;
    this.adminService.roles = undefined;
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.loadUserSubs?.unsubscribe();
  }

}
