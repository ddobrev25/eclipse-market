import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  hamburgerMenu: boolean = false;
  checked: boolean = false;

  private sub = this.router.events.subscribe(() => {
    this.hamburgerMenu = false;
  });

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  onToggleNavbar() {
    this.hamburgerMenu = !this.hamburgerMenu;
  }
  onToggleTheme() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      localStorage.removeItem('theme');
      localStorage.setItem('theme', 'light')
    }
    if (currentTheme === 'light') {
      localStorage.removeItem('theme');
      localStorage.setItem('theme', 'dark')
    }
    document.body.classList.toggle('light-theme');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
