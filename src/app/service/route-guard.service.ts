import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(
    public auth: AuthenticationService,
    public router: Router
  ) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  canAccess(userNamePath): boolean {
    if (!this.auth.isSameUser(userNamePath)) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
