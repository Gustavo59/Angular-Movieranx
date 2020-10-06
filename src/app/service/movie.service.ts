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

  async getMovieData(id: string) {
    const url = `${environment.movieBaseUrl}/v1/movie/findbyid/${id}`;
    let response = await this.http.get<Movie>(url).toPromise();
    return response
  }


}
