import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User$, UserGetInfoResponse } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/http/user.service';
import { UserDataService } from 'src/app/core/services/store/user.data.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  //need to fix
  userInfo?: any;
  loadUserSubs: Subscription | undefined;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.userInfo = this.userDataService.userData;
  }

  loadUserInfo() {
    if (!this.userDataService.userData) {
      this.loadUserSubs = this.userService.getInfo().subscribe({
        next: (resp: UserGetInfoResponse) => {
          this.userDataService.setUserData(resp);
          this.userInfo = resp;
          return;
        },
      });
    }
    
  }

  onLogOut() {
    localStorage.clear();
    this.userDataService.setUserData(null);
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.loadUserSubs?.unsubscribe();
  }
}
