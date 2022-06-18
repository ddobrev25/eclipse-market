import { Component, OnInit } from '@angular/core';
import { IUsers } from 'src/app/_models/user.model';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.scss']
})
export class AdminManageComponent implements OnInit {
  accounts?: IUsers;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    setTimeout(() => {}, 4000)
    this.accounts = this.adminService.accounts;
  }

}
  
