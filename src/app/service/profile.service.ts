import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private session: SessionService
  ) { }

  updateProfile(user: User): Observable<User> {
    const url = `${environment.userBaseUrl}/v1/user/updateuser/${this.session.userId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<User>(url, user, httpOptions);
  }

  getAllUsers():Observable<User[]>{
    const url = `${environment.userBaseUrl}/v1/user/listalluser/`;
    return this.http.get<User[]>(url);

  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError({
      status: error.status,
      message: error.error
    });
  };
}
