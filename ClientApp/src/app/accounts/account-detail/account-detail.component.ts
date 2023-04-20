import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { User$, UserGetInfoResponse } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/http/user.service';
import { UserDataService } from 'src/app/core/services/store/user.data.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
})
export class AccountDetailComponent implements OnInit {
  itemsDefault?: MenuItem[];
  itemsAdmin?: MenuItem[];
  activeItem?: MenuItem;

  loadUserSubs?: Subscription;
  fetchUserInfoSubs?: Subscription;

  isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.patchNavbar();
  }

  patchNavbar() {
    this.itemsDefault = [
      {
        label: 'Лична Информация',
        icon: 'pi pi-fw pi-user',
        routerLink: 'info',
      },
      {
        label: 'Смяна на парола',
        icon: 'pi pi-fw pi-lock',
        routerLink: 'edit',
      },
      {
        label: 'Съобщения',
        icon: 'pi pi-fw pi-envelope',
        routerLink: 'messages',
      },
      {
        label: 'Моите обяви',
        icon: 'pi pi-fw pi-file',
        routerLink: 'listings',
      },
      {
        label: 'Отметки',
        icon: 'pi pi-fw pi-bookmark',
        routerLink: 'bookmarks',
      },
    ];
    this.itemsAdmin = [
      {
        label: 'Лична Информация',
        icon: 'pi pi-fw pi-user',
        routerLink: 'info',
      },
      {
        label: 'Смяна на парола',
        icon: 'pi pi-fw pi-lock',
        routerLink: 'edit',
      },
      {
        label: 'Съобщения',
        icon: 'pi pi-fw pi-envelope',
        routerLink: 'messages',
      },
      {
        label: 'Моите обяви',
        icon: 'pi pi-fw pi-file',
        routerLink: 'listings',
      },
      {
        label: 'Отметки',
        icon: 'pi pi-fw pi-bookmark',
        routerLink: 'bookmarks',
      },
      {
        label: 'Admin panel',
        icon: 'pi pi-fw pi-cog',
        routerLink: 'admin-panel',
      },
    ];
    this.activeItem = this.itemsDefault[0];
  }

  loadUserInfo() {
    this.fetchUserInfoSubs = this.userDataService.userData.subscribe({
      next: (data: User$ | null) => {
        if (data && data.firstName) {
          this.checkForAdmin();
          return;
        } else {
          this.loadUserSubs = this.userService.getInfo().subscribe({
            next: (resp: UserGetInfoResponse) => {
              this.userDataService.setUserData(resp);
              this.checkForAdmin();
            },
          });
        }
      },
      error: (err) => console.log(err),
    });
  }

  checkForAdmin() {
    if(!localStorage.getItem('claims')) return;
    const claims = localStorage.getItem('claims');
    const a = JSON.parse(claims!).toString()
    const b = a.split(',')
    b.forEach((claim: string) => {
      if(claim.toLowerCase() === 'roledeleteclaim') this.isAdmin = true;
    });
  }

  ngOnDestroy() {
    this.loadUserSubs?.unsubscribe();
    this.fetchUserInfoSubs?.unsubscribe();
  }
}
