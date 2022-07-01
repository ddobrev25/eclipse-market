import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IUser } from 'src/app/_models/user.model';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  userInfo: IUser | undefined;

  updateUserSubs: Subscription | undefined;
  deleteUserSubs: Subscription | undefined;

  constructor(private userService: UserService,
              private router: Router,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  updateForm: FormGroup = new FormGroup({
    currentPassword: new FormControl('', [Validators.required ,Validators.maxLength(50), Validators.minLength(6),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$')]),
    newPassword: new FormControl('', [Validators.required ,Validators.maxLength(50), Validators.minLength(6),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$')]),
  });


  onEditUser() {
    const body = {
      "CurrentPassword": this.updateForm.get('currentPassword')?.value,
      "NewPassword": this.updateForm.get('newPassword')?.value,
    };

    this.updateUserSubs = this.userService.changePassword(body).subscribe({
      complete: () => {
        this.messageService.add({key: 'tc', severity:'success', detail: `Промените са запазени!`, life: 3000});
        this.updateForm.reset();
        this.reloadCurrentRoute();
      },
      error: err => {
        console.log(err);
      }
    });
  }
  onDeleteUser() {
    const body = {
      id: 0
    }
    this.confirmationService.confirm({
      message: `Сигурнили сте, че искате да изтриете своят акаунт ?`,
      header: 'Потвърди',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Не',
      accept: () => {
        this.deleteUserSubs = this.userService.delete(body).subscribe({
            complete: () => {
              localStorage.clear()
              this.messageService.add({key: 'tc', severity:'success', detail: `Успешно изтрихте акаунта си!`, life: 3000});
              this.router.navigate(['/home']);
            }
          })
      }
    });
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  loadUserInfo() {
    this.userInfo = this.userService.loggedUser;
  }

  ngOnDestroy() {
    this.updateUserSubs?.unsubscribe();
    this.deleteUserSubs?.unsubscribe();
  }

}
