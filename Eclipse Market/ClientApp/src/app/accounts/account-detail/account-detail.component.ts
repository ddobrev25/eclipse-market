import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {

  }
  onLogOut() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }
}

