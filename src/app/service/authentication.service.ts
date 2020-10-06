import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionService } from './session.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private session: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public isAuthenticated(): boolean {
    const user = localStorage.getItem('userId');

    // Check whether the user is logged or not
    // true or false
    if (user != null) {
      return true
    } else {
      return false
    }
  }

  public isSameUser(userNamePath): boolean {
    const userName = localStorage.getItem('username');

    // Check whether the user is logged or not
    // true or false
    if (userName == userNamePath) {
      return true
    } else {
      return false
    }
  }

  login(login: string, password: string): Observable<any> {
    const url = `${environment.userBaseUrl}/v1/user/login`;

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-authentication-token',
        'userLogin': login,
        'password': password
      })
    };

    return this.http.get<User>(url, httpOptions);
  }

  getUserData(login: string): Observable<any> {
    const url = `${environment.userBaseUrl}/v1/user/findbyid/${this.session.userId}`;
    return this.http.get<User>(url);
  }
}
