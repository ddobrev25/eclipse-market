import { Component, OnInit } from '@angular/core';
import { IUsers } from 'src/app/_models/user.model';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.scss']
})
export class AdminManageComponent implements OnInit {
  userList: IUsers = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (response: IUsers) => {
        console.log(response)
        this.userList = response;
        this.userList.forEach(user => {
          // user.Role = 'test';
        });
      }
    })
  }

}
