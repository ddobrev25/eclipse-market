import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  userId = 0;
  userInfo: IUser | undefined;

  updateSubscription: Subscription | undefined;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.userId = +localStorage.getItem('userId')!;
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

  updateForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2)]),
    userName: new FormControl('', [Validators.maxLength(50), Validators.minLength(3)]),
    email: new FormControl('', [Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+.[a-z]{2,3}')]),
    password: new FormControl('', [Validators.maxLength(50), Validators.minLength(6),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$')]),
    confirmPassword: new FormControl('', [Validators.maxLength(50), Validators.minLength(6),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$')]),
    phoneNumber: new FormControl(''),
  }, { validators: this.passwordMatchingValidator });


  onEditUser() {
      const body = {
        "Id": this.userId,
        "FirstName": this.updateForm.get('firstName')?.value,
        "LastName": this.updateForm.get('lastName')?.value,
        "UserName": this.updateForm.get('userName')?.value,
        "Email": this.updateForm.get('email')?.value,
        "Password": this.updateForm.get('password')?.value,
        "PhoneNumber": this.updateForm.get('phoneNumber')?.value,
        "RoleId": this.userInfo?.RoleId
      };
  
      this.updateSubscription = this.userService.update(body).subscribe({
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

  ngOnDestroy() {
    this.updateSubscription?.unsubscribe();
  }

}
