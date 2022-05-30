import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {
  userId: any;

  constructor(private route: ActivatedRoute,
              ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.userId = +params['id'];
        console.log(this.userId)
      }
    )
  }

}
