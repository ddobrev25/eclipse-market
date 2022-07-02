import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-listing-create',
  templateUrl: './listing-create.component.html',
  styleUrls: ['./listing-create.component.scss']
})
export class ListingCreateComponent implements OnInit {
  items?: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.items = [
      {label: 'Обща информация', routerLink: 'general'},
      {label: 'Цена', routerLink: 'pricing'},
      {label: 'Снимки', routerLink: 'gallery'},
      {label: 'Преглед', routerLink: 'preview'},
  ];
  }

}
