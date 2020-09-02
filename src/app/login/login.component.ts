import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { SessionService } from '../service/session.service';
import * as $ from 'jquery';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  callRegisterComponent = false;

  @Input() user: User = <User>{};
  @Output() userOut: EventEmitter<User> = new EventEmitter();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    if (this.sessionService.getUserLogged() != null) {
      return this.router.navigate(['home']);
    }
  }

  hideWarning(warning) {
    if (warning == "login") {
      (document.querySelector('#login_error_notification') as HTMLElement).style.display = 'none';
    }
  }

  onSubmit() {
    this.authenticationService.login(this.user.login, this.user.password)
      .subscribe(
        res => {
          this.sessionService.saveUserLoggedId(res.id, res.username);
          this.userOut.emit(this.user);
          this.router.navigate(['home']);
        }, error => {
          $("#login_error_notification").css({ "display": "block" })
        }
      )
  }

  toRegister() {
    this.router.navigate(['register']);
  }

}
