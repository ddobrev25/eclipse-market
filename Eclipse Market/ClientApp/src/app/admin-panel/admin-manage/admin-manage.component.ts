import { Component, OnInit } from '@angular/core';
import { IUserGetAllResponse } from 'src/app/_models/user.model';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.scss']
})
export class AdminManageComponent implements OnInit {
  userList: IUserGetAllResponse[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
     this.userService.getAll().subscribe({
       next: response => {
        console.log(response[0])
        this.userList.push(response[0])
       },
       error: err => {
         console.log(err);
       }
      })
  }

}
