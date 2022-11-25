import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from 'src/app/core/services/http/user.service';
import { User$, UserChangePassword } from 'src/app/core/models/user.model';
import { UserDataService } from 'src/app/core/services/store/user.data.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
  userInfo: User$ | undefined;

  fetchInfoSubs: Subscription | undefined;
  updateUserSubs: Subscription | undefined;
  deleteUserSubs: Subscription | undefined;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    //! Check if I need the info of the user!
    // this.loadUserInfo();
  }

  updateForm: FormGroup = new FormGroup({
    currentPassword: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(6),
      Validators.pattern(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$'
      ),
    ]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(6),
      Validators.pattern(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$'
      ),
    ]),
  });

  onEditUser() {
    const body: UserChangePassword = {
      currentPassword: this.updateForm.get('currentPassword')?.value,
      newPassword: this.updateForm.get('newPassword')?.value,
    };

    this.updateUserSubs = this.userService.changePassword(body).subscribe({
      complete: () => {
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          detail: `Промените са запазени!`,
          life: 3000,
        });
        this.updateForm.reset();
        this.reloadCurrentRoute();
      },
      error: (err) => console.log(err),
    });
  }
  onDeleteUser() {
    const body = {
      id: 0,
    };
    this.confirmationService.confirm({
      message: `Сигурнили сте, че искате да изтриете своят акаунт ?`,
      header: 'Потвърди',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Не',
      accept: () => {
        this.deleteUserSubs = this.userService.delete(body).subscribe({
          complete: () => {
            localStorage.clear();
            this.messageService.add({
              key: 'tc',
              severity: 'success',
              detail: `Успешно изтрихте акаунта си!`,
              life: 3000,
            });
            this.router.navigate(['/home']);
          },
        });
      },
    });
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  // loadUserInfo() {
  //   //need to fix
  //   this.fetchInfoSubs = this.userDataService.userData.subscribe({
  //     next: (data) => {

  //     }
  //   })
  // }

  ngOnDestroy() {
    this.updateUserSubs?.unsubscribe();
    this.deleteUserSubs?.unsubscribe();
    this.fetchInfoSubs?.unsubscribe();
  }
}
