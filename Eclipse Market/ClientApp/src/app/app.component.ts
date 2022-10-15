import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from './shared/spinner/spinner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EclipseMarket';

  public spinnerComponent = SpinnerComponent;

  ngOnInit() {
      const themePreference = localStorage.getItem('theme');
      if(!themePreference) {
        localStorage.setItem('theme', 'dark')
      }
      if (themePreference === 'light') {
        document.body.classList.add('light-theme');
      }
      console.log(themePreference);
    }
}
