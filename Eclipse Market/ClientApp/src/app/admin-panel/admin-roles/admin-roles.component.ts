import { formatPercent } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IRoles } from 'src/app/_models/role.model';
import { RoleService } from 'src/app/_services/role.service';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.scss']
})
export class AdminRolesComponent implements OnInit, OnDestroy {
  roleList: IRoles = [];
  roleGetSubs: Subscription | undefined;


  constructor(private roleService: RoleService) { }

  ngOnInit() {
    this.fetchRoles();
  }

  fetchRoles() {
    this.roleGetSubs = this.roleService.getAll().subscribe({
      next: (resp: IRoles) => {
        this.roleList = resp;
        console.log(this.roleList)
      },
      error: err => {
        console.log(err);
      }
    })
  }

  ngOnDestroy(): void {
    this.roleGetSubs?.unsubscribe();
  }

}
