import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../interfaces/user';
import { AuthenticationService } from '../service/authentication.service';
import { ProfileService } from '../service/profile.service';
import { RouteGuardService } from '../service/route-guard.service';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  loading = false;
  submitted = false;
  userForm: FormGroup;
  equalPass = true;
  minLength = true;
  emailValid = true;
  registered = false;
  loaded = false;

  constructor(
    private profileService: ProfileService,
    private authenticationService: AuthenticationService,
    private session: SessionService,
    private routeGuard: RouteGuardService
  ) {
  }

  @Input() user: User = <User>{};
  @ViewChild('email') emailElement: ElementRef;
  @ViewChild('password') passwordElement: ElementRef;
  @ViewChild('confirmPassword') confirmPasswordElement: ElementRef;

  ngOnInit() {
    this.routeGuard.canAccess()

    this.authenticationService.getUserData(this.session.userId)
      .subscribe(data => {
        this.user = data;
        this.loaded = true;
      });

    this.userForm = this.createUserForm();
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

  validateForm() {

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
  }

  hideWarning(warning) {
    if (warning == "update") {
      (document.querySelector('#update_profile_error_notification') as HTMLElement).style.display = 'none';
    }
  }

  onSubmit() {
    this.loading = true;
    this.user = this.userForm.value;
    this.user.active = true;

    this.validateForm()

    if (this.equalPass && this.minLength && this.userForm.valid) {
      this.profileService.updateProfile(this.user).subscribe(
        (res: any) => {
          console.log("Atualizado com sucesso!")
          this.loading = true;
        },
        (err: any) => {
          this.loading = false;
          console.log("Erro ao atualizar perfil")
          console.log(err);

          (document.querySelector('#update_profile_error_notification') as HTMLElement).style.display = 'block';
        }
      )
    }
  }

}
