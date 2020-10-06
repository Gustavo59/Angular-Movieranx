import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Movie,  } from '../interfaces/movie';
import { RecommendedMovie } from '../interfaces/recommendedMovie'
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }

  async findMoviesByTerm(term: string): Promise<any> {
    const url = `${environment.movieBaseUrl}/v1/movie/findMoviesByTerm/${term}`;
    return this.http.get<Array<Movie>>(url).toPromise();
  
  }

  getRecommendedMoviesByImdbId(imdbId:string){
    const url = `${environment.recommendationBaseUrl}/api/get_top_ten/${imdbId}`;
    return this.http.get<string[]>(url)
  }


  getPopularMoviesByGenre(genre: string) {
    const url = `${environment.movieBaseUrl}/v1/movie/getTopMoviesByGenre/${genre}`;
    return this.http.get<Movie[]>(url)
  }

  getAllMoviesById(movies: string[]) {
    const url = `${environment.movieBaseUrl}/v1/movie/getmoviesbyid?movies=${movies}`;

    return this.http.get<Movie[]>(url)
  }
  getAllMoviesByImdbId(movies: string[]) {
    const url = `${environment.movieBaseUrl}/v1/movie/getmoviesbyimdbid?movies=${movies}`;
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
