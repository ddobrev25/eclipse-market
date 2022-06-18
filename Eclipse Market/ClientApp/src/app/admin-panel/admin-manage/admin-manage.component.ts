import { Component, OnInit } from '@angular/core';
import { IUsers } from 'src/app/_models/user.model';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.scss']
})
export class AdminManageComponent implements OnInit {
  accounts?: IUsers;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (resp) => {
        this.accounts = resp;
        this.accounts.forEach(account => {
          if(account.roleId === 5) {
            account.role = 'Admin'
          } else if(account.roleId === 10) {
            account.role = 'User'
          }
        });
      }
    })
  }

}
  
