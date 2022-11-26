import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  User,
  User$,
  UserGetInfoResponse,
} from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/http/user.service';
import { UserDataService } from 'src/app/core/services/store/user.data.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  userInfo?: User;
  loadUserSubs?: Subscription;
  fetchUserInfoSubs?: Subscription;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.fetchUserInfoSubs = this.userDataService.userData.subscribe({
      next: (data: User$) => {
        if (data && data.firstName) {
          this.userInfo = data;
        } else {
          this.loadUserSubs = this.userService.getInfo().subscribe({
            next: (resp: UserGetInfoResponse) => {
              this.userDataService.setUserData(resp);
              this.userInfo = resp;
            },
          });
        }
      },
      error: (err) => console.log(err),
    });
  }

  onLogOut() {
    localStorage.clear();
    this.userDataService.setUserData(null);
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.loadUserSubs?.unsubscribe();
    this.fetchUserInfoSubs?.unsubscribe();
  }
}
