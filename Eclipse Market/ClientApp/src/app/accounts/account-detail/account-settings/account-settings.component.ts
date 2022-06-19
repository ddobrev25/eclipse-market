import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { IUser } from 'src/app/_models/user.model';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  userInfo: IUser | undefined;

  updateSubscription: Subscription | undefined;
  loadUserSubs: Subscription | undefined;

  constructor(private userService: UserService,
              private router: Router,
              private messageService: MessageService) { }

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

    this.updateSubscription = this.userService.changePassword(body).subscribe({
      next: data => {
        this.messageService.add({key: 'tc', severity:'success', summary: 'Success', detail: `Changes applied!`, life: 3000});
        this.updateForm.reset();
        this.reloadCurrentRoute();
      },
      error: err => {
        console.log(err);
      }
    });
  }
  onDeleteUser() {
    
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  loadUserInfo() {
    this.loadUserSubs = this.userService.getInfo().subscribe({
      next: (resp: IUser) => {
        this.userInfo = resp;
      }
    })
  }

  ngOnDestroy() {
    this.updateSubscription?.unsubscribe();
    this.loadUserSubs?.unsubscribe();
  }

}
