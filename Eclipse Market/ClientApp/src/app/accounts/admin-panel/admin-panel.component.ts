import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  navs?: MenuItem[];

  constructor() { }

  ngOnInit(): void {
    this.navs = [
      {label:'Акаунти', routerLink: ['manage-accounts'],},
      {label:'Роли', routerLink: ['manage-roles']}
    ]
  }



}
