import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from './core/services/store/user.data.service';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { SignalrService } from './signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'EclipseMarket';
  // public spinnerComponent = SpinnerComponent;

  // constructor(private userDataService: UserDataService) {

  // }

  // ngOnInit() {
  //   this.setTheme();
  // }
  // setTheme(): void {
  //   const themePreference = localStorage.getItem('theme');
  //   if (!themePreference) {
  //     localStorage.setItem('theme', 'dark');
  //   }
  //   if (themePreference === 'light') {
  //     document.body.classList.add('light-theme');
  //   }
  // }

  // isLogged() {
    
  // }
  @ViewChild('msgInput') message?: any;
  someResponse?: string;


  constructor(private signalrService: SignalrService) {}

  ngOnInit() {
    this.signalrService.startConnection();
    this.signalrService.askServerListener();
  }

  onSendMessage() {
    this.signalrService.askServer(this.message!.nativeElement.value);
  }


  ngOnDestroy() {
    this.signalrService.hubConnection.off("askServerResponse");
  }

}
