import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }

  getPopularMoviesByGenre(genre:string){
    const url = `${environment.movieBaseUrl}v1/movie/getTopMoviesByGenre/`+genre;
    return this.http.get<Movie[]>(url)
  }
}
