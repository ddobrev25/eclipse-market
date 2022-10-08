import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  hamburgerMenu: boolean = false;

  private sub = this.router.events.subscribe(() => {
    this.hamburgerMenu = false;
  });

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  onToggleNavbar() {
    this.hamburgerMenu = !this.hamburgerMenu;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
