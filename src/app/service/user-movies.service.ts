import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { UserMovies } from '../interfaces/userMovies';

@Injectable({
  providedIn: 'root'
})
export class UserMoviesService {

  constructor(
    private http: HttpClient
  ) { }

  getUserMovieRating(userId: string, movieId: string): Observable<any> {
    const url = `${environment.userMoviesBaseUrl}/v1/user/movies/findrate/${userId}/${movieId}`

    return this.http.get<UserMovies>(url);
  }

  rateMovie(userMovies: UserMovies): Observable<any> {
    const url = `${environment.userMoviesBaseUrl}/v1/user/movies/rate`

    return this.http.post<UserMovies>(url, userMovies).pipe(
      catchError(this.handleError)
    );
  }

  updateRating(userMovies: UserMovies, id: string): Observable<any> {
    const url = `${environment.userMoviesBaseUrl}/v1/user/movies/updaterating/${id}`

    return this.http.put<UserMovies>(url, userMovies).pipe(
      catchError(this.handleError)
    );
  }

  deleteRating(id: string): Observable<any> {
    const url = `${environment.userMoviesBaseUrl}/v1/user/movies/deleterating/${id}`

    return this.http.delete<UserMovies>(url)
  }

  getAllWatchedMovies(userId: string): Observable<any> {
    const url = `${environment.userMoviesBaseUrl}/v1/user/movies/findwatchedmovies/${userId}`

    return this.http.get<Array<UserMovies>>(url)
  }

  getAllSavedMovies(userId: string): Observable<any> {
    const url = `${environment.userMoviesBaseUrl}/v1/user/movies/findsavedmovies/${userId}`

    return this.http.get<Array<UserMovies>>(url)
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message)
    }
    else {
      console.error(
        `Backend returned cod ${error.error.message},` +
        `the body was: ${error.error}`
      );
    }

    return throwError({
      status: error.status,
      message: error.error
    })
  }
}
