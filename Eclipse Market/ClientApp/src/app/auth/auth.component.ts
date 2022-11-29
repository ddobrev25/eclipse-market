import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UserService } from '../core/services/http/user.service';
import { UserDataService } from '../core/services/store/user.data.service';
import { UserGetInfoResponse, UserRegisterRequest } from '../core/models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  registerMode: boolean = false;

  registerSubscription: Subscription | undefined;
  loadUserSubs: Subscription | undefined;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.checkToken();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  temp(event: any) {
    console.log(event);
  }

  //!Login
  loginForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onLogIn() {
    const body = {
      userName: this.loginForm.get('userName')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this.userService.logIn(body).subscribe({
      next: (resp) => {
        if (resp && resp.token !== null) {
          localStorage.setItem('token', JSON.stringify(resp.token));
          localStorage.setItem('claims', JSON.stringify(resp.claims));
          this.checkToken();
        }
      },
      complete: () => {
        this.loadUserInfo();
        this.userDataService.isLoggedIn = true;
      },
    });
  }
  loadUserInfo() {
    if (!this.userDataService.userData) {
      this.loadUserSubs = this.userService.getInfo().subscribe({
        next: (resp: UserGetInfoResponse) => {
          this.userDataService.setUserData(resp);
        },
        complete: () => {
          this.router.navigate(['/home']);
        },
      });
    }
  }

  //!/Login
  //!Register
  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  passwordMatchingValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password?.value === confirmPassword?.value
      ? null
      : { notmatched: true };
  };

  registerForm: FormGroup = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(2),
        Validators.required,
      ]),
      lastName: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(2),
        Validators.required,
      ]),
      userName: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+.[a-z]{2,3}'),
      ]),
      password: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(6),
        Validators.pattern(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$'
        ),
        Validators.required,
      ]),
      confirmPassword: new FormControl('', [
        Validators.maxLength(50),
        Validators.minLength(6),
        Validators.pattern(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$'
        ),
        Validators.required,
      ]),
      phoneNumber: new FormControl('', [Validators.required]),
      imageBase64String: new FormControl('', [Validators.required])
    },
    { validators: this.passwordMatchingValidator }
  );

  onRegister() {
    const body: UserRegisterRequest = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      userName: this.registerForm.get('userName')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      phoneNumber: this.registerForm.get('phoneNumber')?.value,
      roleId: 0,
      imageBase64String: "inProgress"
    };

    this.registerSubscription = this.userService.register(body).subscribe({
      next: (resp) => {
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          detail: 'Успешна регистрация!',
          life: 3000,
        });
        this.router.navigate(['/home']);
      },
    });
  }
  //!/Register

  ngOnDestroy(): void {
    this.registerSubscription?.unsubscribe();
    this.loadUserSubs?.unsubscribe();
  }
}
