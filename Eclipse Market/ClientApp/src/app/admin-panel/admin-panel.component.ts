import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../_services/admin.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  accountSubscription: Subscription | undefined;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getAccounts();
    this.accountSubscription = this.adminService.accountsObs.subscribe(
      resp => {
        this.adminService.accounts = resp;
      }
    );
  }

  ngOnDestroy() {
    this.accountSubscription?.unsubscribe();
  }


}
