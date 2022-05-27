import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AccountsService } from '../_services/accounts.service';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  providers: [AccountsService]
})
export class AccountsComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = true;
  regRedirect: boolean = false;

  registerSubscription: Subscription | undefined;

  constructor(private accountService: AccountsService ) { }

  ngOnInit(): void {
    // this.checkToken();
  }

  toggle(){
    this.isLoggedIn=!this.isLoggedIn;
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  //!Login
  loginForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  logIn() {
    const body = {
      "userName": this.loginForm.get('userName')?.value,
      "password": this.loginForm.get('password')?.value
    }
    // console.log(body);

    this.accountService.logIn(body).subscribe({
      next: token => {
        if (token !== null) {
          localStorage.setItem('token', JSON.stringify(token));
          this.checkToken();
        }
      },
      error: err => {
        console.log('ERROR: ', err);
      }
    });
  }

  logOut() {
    localStorage.removeItem('token');
    this.checkToken();
  }

  //!/Login







  //!Register
  registerToggle(){
    this.regRedirect = !this.regRedirect;
  }

  passwordMatchingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
  
    return password?.value === confirmPassword?.value ? null : { notmatched: true };
  };

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2), Validators.required]),
    lastName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2), Validators.required]),
    userName: new FormControl('', [Validators.maxLength(50), Validators.minLength(3), Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+.[a-z]{2,3}')]),
    password: new FormControl('', [Validators.maxLength(50), Validators.minLength(6),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$'), Validators.required]),
    confirmPassword: new FormControl('', [Validators.maxLength(50), Validators.minLength(6),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$'), Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
  }, { validators: this.passwordMatchingValidator });

  onRegister() {
    const body = {
      "FirstName": this.registerForm.get('firstName')?.value,
      "LastName": this.registerForm.get('lastName')?.value,
      "UserName": this.registerForm.get('userName')?.value,
      "Email": this.registerForm.get('email')?.value,
      "Password": this.registerForm.get('password')?.value,
      "PhoneNumber": this.registerForm.get('phoneNumber')?.value
    };

    this.registerSubscription = this.accountService.addUser(body).subscribe({
      next: data => {
        console.log(data);
      },
      error: err => {
        console.log(err);
      }
    });
  }
  //!/Register
  
  onSubmit() {
    console.log(this.registerForm.getRawValue()); 
  }


  ngOnDestroy(): void {
    this.registerSubscription?.unsubscribe();
  }

}
