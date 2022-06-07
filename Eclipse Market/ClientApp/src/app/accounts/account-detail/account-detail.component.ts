import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {
  userId: any;

  loadedUser = null;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.userId = +params['id'];
      }
    )
    this.onLoadUserInfo();
  }

  onLoadUserInfo() {
    this.userService.getInfo(this.userId).subscribe({
      next: (response: any) => {
        // console.log(response);
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  onLogOut() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }
}

