import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/_models/user.model';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  userInfo: IUser | undefined;
  loadUserSubs: Subscription | undefined;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.loadUserSubs = this.userService.getInfo().subscribe({
      next: (resp: IUser) => {
        this.userInfo = resp;
      }
    })
  }

  ngOnDestroy() {
    this.loadUserSubs?.unsubscribe();
  }

}
