import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionService } from './session.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private session: SessionService
  ) { }

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
    const url = `${environment.userBaseUrl}/v1/user/findById/${this.session.userId}`;
    return this.http.get<User>(url);
  }
}
