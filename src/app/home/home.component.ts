import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../service/movies.service';
import { Movie } from '../interfaces/movie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  comedyMovies: Movie[]
  horrorMovies: Movie[]
  romanceMovies: Movie[]
  sciFiMovies: Movie[]
  actionMovies: Movie[]

  constructor(
    private moviesService: MoviesService
  ) { }

  ngOnInit() {
    this.moviesService.getPopularMoviesByGenre("Comedy").subscribe(data => {
      console.log(data)
      this.comedyMovies = data

      this.moviesService.getPopularMoviesByGenre("Horror").subscribe(data => {
        this.horrorMovies = data

        this.moviesService.getPopularMoviesByGenre("Romance").subscribe(data => {
          this.romanceMovies = data

          this.moviesService.getPopularMoviesByGenre("Science Fiction").subscribe(data => {
            this.sciFiMovies = data

            this.moviesService.getPopularMoviesByGenre("Action").subscribe(data => {
              this.actionMovies = data
            });
          });
        });
      });
    });
  }
}
