import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MessageSignalrService } from './core/services/message.signalr.service';
import { UserDataService } from './core/services/store/user.data.service';
import { SpinnerComponent } from './shared/spinner/spinner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'EclipseMarket';
  showNotificationDialog = true;
  public spinnerComponent = SpinnerComponent;
  @ViewChild('sm') ul?: ElementRef;

  constructor(private userDataService: UserDataService,
    private messageSignalrService: MessageSignalrService) {

  }

  ngOnInit() {
    this.setTheme();
    this.messageSignalrService.startConnection();
    this.messageSignalrService.messageAddListener();
    this.messageSignalrService.messageEditListener();
    this.messageSignalrService.messageDeleteListener();
    this.messageSignalrService.chatCreateListener();
  }
  setTheme(): void {
    const themePreference = localStorage.getItem('theme');
    if (!themePreference) {
      localStorage.setItem('theme', 'dark');
    }
    if (themePreference === 'light') {
      document.body.classList.add('light-theme');
    }
  }

  isLogged() {
    
  }


}
