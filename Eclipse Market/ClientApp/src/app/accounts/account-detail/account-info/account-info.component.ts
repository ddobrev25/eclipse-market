import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/_models/user.model';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {
  userInfo: IUser | undefined;

  updateSubscription: Subscription | undefined;

  constructor(private userService: UserService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnInit(): void {
    this.onLoadUserInfo();
  }
  onLoadUserInfo() {
    this.updateSubscription = this.userService.getInfo().subscribe({
      next: (response: any) => {
        console.log(response)
        this.userInfo = response;
      }
    });
  }

  passwordMatchingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
  
    return password?.value === confirmPassword?.value ? null : { notmatched: true };
  };

  editForm = new FormGroup({
    firstName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2)]),
    userName: new FormControl('', [Validators.maxLength(50), Validators.minLength(3)]),
    email: new FormControl('', [Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+.[a-z]{2,3}')]),
    phoneNumber: new FormControl(''),
  }, { validators: this.passwordMatchingValidator });

  onEditUser() {
    const body = {
      "FirstName": this.editForm.get('firstName')?.value,
      "LastName": this.editForm.get('lastName')?.value,
      "UserName": this.editForm.get('userName')?.value,
      "Email": this.editForm.get('email')?.value,
      "Password": this.userInfo?.password,
      "PhoneNumber": this.editForm.get('phoneNumber')?.value,
      "RoleId": this.userInfo?.roleId
    };

    this.updateSubscription = this.userService.update(body).subscribe({
      next: data => {
        this.messageService.add({key: 'tc', severity:'success', summary: 'Success', detail: `Changes applied!`, life: 3000});
        this.editForm.reset();
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
}
