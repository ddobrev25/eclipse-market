import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {

  constructor(private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {

  }
  onLogOut() {
    localStorage.clear();
    this.userService.loggedUser = undefined;
    this.router.navigate(['/home']);
  }
}

