import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';
import { RegisterService } from '../service/register.service';
import { User } from '../interfaces/user';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loading = false;
  submitted = false;
  userForm: FormGroup;
  equalPass = true;
  minLength = true;
  emailValid = true;
  usernameValid = true;
  registered = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private registerService: RegisterService,
    private alertService: AlertService,
    private sessionService: SessionService
  ) {
    this.userForm = this.createUserForm();
  }

  @Input() user: User = <User>{};
  @ViewChild('email') emailElement: ElementRef;
  @ViewChild('password') passwordElement: ElementRef;
  @ViewChild('confirmPassword') confirmPasswordElement: ElementRef;
  @ViewChild('username') usernameElement: ElementRef;
  @ViewChild('firstName') firstNameElement: ElementRef;
  @ViewChild('lastName') lastNameElement: ElementRef;

  createUserForm() {
    return new FormGroup({
      'username': new FormControl(this.user.username, [Validators.required, Validators.minLength(3)]),
      'email': new FormControl(this.user.email, [Validators.required, Validators.email]),
      'password': new FormControl(this.user.password, [Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl(this.user.password, [Validators.required, Validators.minLength(6)]),
      'firstName': new FormControl(this.user.firstName, [Validators.required]),
      'lastName': new FormControl(this.user.lastName, [Validators.required])
    });
  }

  ngOnInit() {
    if (this.sessionService.getUserLogged() != null) {
      return this.router.navigate(['home']);
    }
  }

  redirectToLogin() {
    this.router.navigate(['']);
  }

  hideWarning(warning) {
    if (warning == "username") {
      (document.querySelector('#username_registered_notification') as HTMLElement).style.display = 'none';
    } else if (warning == "email") {
      (document.querySelector('#email_registered_notification') as HTMLElement).style.display = 'none';
    } else if (warning == "login") {
      (document.querySelector('#login_error_notification') as HTMLElement).style.display = 'none';
    }
  }

  onSubmit() {
    this.loading = true;
    this.user = this.userForm.value;
    this.user.active = true;

    this.validateForm()

    if (this.equalPass && this.minLength && this.userForm.valid) {
      this.registerService.register(this.user).subscribe(
        (res: any) => {
          this.login(this.user.username, this.user.password);
        },
        (err: any) => {
          this.loading = false;
          console.log(err);

          if (err.message === "EMAIL_ALREADY_REGISTERED") {
            (document.querySelector('#email_registered_notification') as HTMLElement).style.display = 'block';

            this.emailElement.nativeElement.classList.add('is-danger');
            this.emailElement.nativeElement.classList.remove('is-success');
          } else if (err.message === "USERNAME_ALREADY_REGISTERED") {
            (document.querySelector('#username_registered_notification') as HTMLElement).style.display = 'block';
          }
        }
      )
    }
  }

  private login(login: string, password: string) {
    this.authenticationService.login(login, password).subscribe(
      resp => {
        this.loading = false;
        this.sessionService.saveUserLoggedId(resp.id, resp.username);
        this.router.navigate(['home']);
      },
      error => {
        this.loading = false;
        console.log(error);

        (document.querySelector('#login_error_notification') as HTMLElement).style.display = 'block';

        this.router.navigate([''])
      }
    )
  }

  validateForm() {

    console.log(this.userForm)

    if (this.userForm.value.password != null) {
      this.equalPass = this.userForm.value.password === this.userForm.value.confirmPassword;

      if (!this.equalPass) {
        this.passwordElement.nativeElement.classList.add('is-danger');
        this.confirmPasswordElement.nativeElement.classList.add('is-danger');
        this.passwordElement.nativeElement.classList.remove('is-success');
        this.confirmPasswordElement.nativeElement.classList.remove('is-success');
      } else {
        this.passwordElement.nativeElement.classList.remove('is-danger');
        this.confirmPasswordElement.nativeElement.classList.remove('is-danger');
        this.passwordElement.nativeElement.classList.add('is-success');
        this.confirmPasswordElement.nativeElement.classList.add('is-success');
      }

      this.minLength = this.userForm.value.password.length >= 6 && this.userForm.value.confirmPassword.length >= 6;

      if (!this.minLength) {
        this.passwordElement.nativeElement.classList.add('is-danger');
        this.confirmPasswordElement.nativeElement.classList.add('is-danger');
        this.passwordElement.nativeElement.classList.remove('is-success');
        this.confirmPasswordElement.nativeElement.classList.remove('is-success');
      } else {
        this.passwordElement.nativeElement.classList.remove('is-danger');
        this.confirmPasswordElement.nativeElement.classList.remove('is-danger');
        this.passwordElement.nativeElement.classList.add('is-success');
        this.confirmPasswordElement.nativeElement.classList.add('is-success');
      }
    } else {
      this.passwordElement.nativeElement.classList.add('is-danger');
      this.confirmPasswordElement.nativeElement.classList.add('is-danger');
    }

    if (this.userForm.value.email != null) {
      this.emailValid = this.userForm.get('email').valid;

      if (!this.emailValid) {
        this.emailElement.nativeElement.classList.remove('is-success');
        this.emailElement.nativeElement.classList.add('is-danger');
      } else {
        this.emailElement.nativeElement.classList.remove('is-danger');
        this.emailElement.nativeElement.classList.add('is-success');
      }
    } else {
      this.emailElement.nativeElement.classList.add('is-danger');
    }

    if (this.userForm.value.username != null) {
      if (!this.userForm.controls.username.valid) {
        this.usernameValid = false;

        this.usernameElement.nativeElement.classList.remove('is-success');
        this.usernameElement.nativeElement.classList.add('is-danger');
      } else {
        this.usernameValid = true;

        this.usernameElement.nativeElement.classList.remove('is-danger');
        this.usernameElement.nativeElement.classList.add('is-success');
      }
    } else {
      this.usernameElement.nativeElement.classList.add('is-danger');
    }

    if (this.userForm.value.firstName != null) {
      if (!this.userForm.controls.firstName.valid) {
        this.firstNameElement.nativeElement.classList.remove('is-success');
        this.firstNameElement.nativeElement.classList.add('is-danger');
      } else {
        this.firstNameElement.nativeElement.classList.remove('is-danger');
        this.firstNameElement.nativeElement.classList.add('is-success');
      }
    } else {
      this.firstNameElement.nativeElement.classList.add('is-danger');
    }

    if (this.userForm.value.lastName != null) {
      if (!this.userForm.controls.lastName.valid) {
        this.lastNameElement.nativeElement.classList.remove('is-success');
        this.lastNameElement.nativeElement.classList.add('is-danger');
      } else {
        this.lastNameElement.nativeElement.classList.remove('is-danger');
        this.lastNameElement.nativeElement.classList.add('is-success');
      }
    } else {
      this.lastNameElement.nativeElement.classList.add('is-danger');
    }
  }

}
