import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/http/user.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {
  itemsDefault?: MenuItem[];
  itemsAdmin?: MenuItem[];
  activeItem?: MenuItem;

  loadUserSubs: Subscription | undefined;


  isAdmin: boolean = false;

  constructor(private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.patchNavbar();
    this.checkForAdmin();
  }

  patchNavbar() {
    this.itemsDefault = [
      {label: 'Лична Информация', icon: 'pi pi-fw pi-user', routerLink: 'info'},
      {label: 'Смяна на парола', icon: 'pi pi-fw pi-lock', routerLink: 'edit'},
      {label: 'Съобщения', icon: 'pi pi-fw pi-envelope', routerLink: 'messages'},
      {label: 'Моите обяви', icon: 'pi pi-fw pi-file', routerLink: 'listings'},
      {label: 'Отметки', icon: 'pi pi-fw pi-bookmark', routerLink: 'bookmarks' },
    ];
    this.itemsAdmin = [
      {label: 'Лична Информация', icon: 'pi pi-fw pi-user', routerLink: 'info'},
      {label: 'Смяна на парола', icon: 'pi pi-fw pi-lock', routerLink: 'edit'},
      {label: 'Съобщения', icon: 'pi pi-fw pi-envelope', routerLink: 'messages'},
      {label: 'Моите обяви', icon: 'pi pi-fw pi-file', routerLink: 'listings'},
      {label: 'Отметки', icon: 'pi pi-fw pi-bookmark', routerLink: 'bookmarks' },
      {label: 'Admin panel', icon: 'pi pi-fw pi-cog', routerLink: 'admin-panel'}
    ];
    this.activeItem = this.itemsDefault[0];
  }

  loadUserInfo() {
    if(!this.userService.loggedUser) {
      this.loadUserSubs = this.userService.getInfo().subscribe({
        next: (resp: IUser) => {
          this.userService.loggedUser = resp;
        },
        complete: () => {
          this.checkForAdmin();
        }
      })
    }
  }

  checkForAdmin() {
      let user: IUser = this.userService.loggedUser!;
      if(user?.roleName == 'admin') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
  }

  ngOnDestroy() {
    this.loadUserSubs?.unsubscribe();
  }


}

