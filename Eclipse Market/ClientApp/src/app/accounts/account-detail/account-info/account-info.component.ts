import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/_models/user.model';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {
  userInfo: IUser | undefined;

  constructor(private accService: AccountService) { }

  ngOnInit(): void {
    this.userInfo = this.accService.accountInfo;
  }

}
