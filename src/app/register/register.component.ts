import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';
import { RegisterService } from '../service/register.service';
import { User } from '../interfaces/user';
import { SessionService } from '../service/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  registered = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private registerService: RegisterService,
    private alertService: AlertService,
    private sessionService: SessionService,
    private snackbar: MatSnackBar
  ) {
    this.userForm = this.createUserForm();
  }

  @Input() user: User = <User>{};
  @ViewChild('email') emailElement: ElementRef;

  validatePass() {
    this.equalPass = this.userForm.value.password === this.userForm.value.confirmPass;
  }

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

  onSubmit() {
    this.loading = true;
    this.user = this.userForm.value;
    this.user.active = true;

    this.registerService.register(this.user).subscribe(
      (res: any) => {
        this.snackbar.open('Cadastro realizado com sucesso!', 'Accept', {
          duration: 3000,
          panelClass: ['green-snackbar']
        });

        this.login(this.user.username, this.user.password);
      },
      (err: any) => {
        this.loading = false;
        console.log(err);

        if (err.message === "EMAIL_ALREADY_REGISTERED") {
          this.snackbar.open('Este email já está cadastrado!', 'Dismiss', {
            duration: 4000,
            panelClass: ['red-snackbar']
          });
        } else if (err.message === "USERNAME_ALREADY_REGISTERED") {
          this.snackbar.open('Este nome de usuário já está sendo utilizado!', 'Dismiss', {
            duration: 4000,
            panelClass: ['red-snackbar']
          });
        }
      }
    )
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

        this.snackbar.open('Não foi possível realiar o login', 'Dismiss', {
          duration: 3000,
          panelClass: ['red-snackbar']
        });
        this.router.navigate([''])
      }
    )
  }

}
