import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Movie } from '../interfaces/movie';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }

  getPopularMoviesByGenre(genre: string) {
    const url = `${environment.movieBaseUrl}/v1/movie/getTopMoviesByGenre/${genre}`;
    return this.http.get<Movie[]>(url)
  }

  getAllMoviesById(movies: string[]) {
    const url = `${environment.movieBaseUrl}/v1/movie/getmoviesbyid?movies=${movies}`;

    return this.http.get<Movie[]>(url)
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message)
    } else {
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
