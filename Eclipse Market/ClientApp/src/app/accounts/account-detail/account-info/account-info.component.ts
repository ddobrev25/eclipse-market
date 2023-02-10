import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  User,
  User$,
  UserGetInfoResponse,
  UserUpdateImageRequest,
} from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/http/user.service';
import { MessageSignalrService } from 'src/app/core/services/message.signalr.service';
import { MessageDataService } from 'src/app/core/services/store/message.data.service';
import { UserDataService } from 'src/app/core/services/store/user.data.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  userInfo?: User;
  loadUserSubs?: Subscription;
  fetchUserInfoSubs?: Subscription;
  updateImgSubs? : Subscription;
  userDataChanged: boolean = false;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private router: Router,
    private messageService: MessageService,
    private messageSignalrService: MessageSignalrService,
    private messageDataService: MessageDataService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo() {
    if(this.userDataChanged) {
      this.loadUserSubs = this.userService.getInfo().subscribe({
        next: (resp: UserGetInfoResponse) => {
          console.log(resp);
          this.userDataService.setUserData(resp);
          this.userInfo = resp;
          this.userDataChanged = false;
          return;
        },
      });
    }
    this.fetchUserInfoSubs = this.userDataService.userData.subscribe({
      next: (data: User$ | null) => {
        if (data === null) {
          this.loadUserSubs = this.userService.getInfo().subscribe({
            next: (resp: UserGetInfoResponse) => {
              this.userDataService.setUserData(resp);
              this.userInfo = resp;
            },
          });
        } else {
          this.userInfo = data;
        }
      },
      error: (err) => console.log(err),
    });
  }

  onToggleUploadImageOverlay(event: any) {
    event.target.children[1].classList.toggle('visible')
  }
  onUploadImage(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) this.onUpdateImage((reader.result).toString());
    };
    reader.onerror = (error) => console.log('Error: ', error);
    event.target.value = '';
  }

  onUpdateImage(image: string) {
    const body: UserUpdateImageRequest = {
      newImageBase64String: image
    }
    this.updateImgSubs = this.userService.updateImage(body).subscribe({
      complete: () => {
        this.userDataChanged = true;
        this.loadUserInfo();
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          detail: 'Профилната снимка е променена успешно!',
          life: 3000,
        });
      },
      error: err => console.log(err)
    })
  }

  onLogOut() {
    this.router.navigate(['/home']);
    this.userDataService.setUserData(null);
    localStorage.clear();
    this.messageSignalrService.stopConnection();
    this.messageDataService.setChats(null);
  }

  ngOnDestroy() {
    this.loadUserSubs?.unsubscribe();
    this.fetchUserInfoSubs?.unsubscribe();
    this.updateImgSubs?.unsubscribe();
  }
}
