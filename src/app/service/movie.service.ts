import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Movie } from '../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(
    private http: HttpClient
  ) { }

  getMovieData(id: string): Observable<any> {
    console.log(id)
    const url = `${environment.movieBaseUrl}/v1/movie/findbyid/${id}`;
    return this.http.get<Movie>(url);
  }


}
