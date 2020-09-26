import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Movie } from '../interfaces/movie';
import { MoviesService } from '../service/movies.service';
import { UserMoviesService } from '../service/user-movies.service';
import { SessionService } from '../service/session.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-user-movies',
  templateUrl: './user-movies.component.html',
  styleUrls: ['./user-movies.component.css']
})
export class UserMoviesComponent implements OnInit {

  filmes: Movie[] = [];
  page = 1;
  pageSize = 16;
  username = localStorage.getItem("username");

  constructor(
    private moviesService: MoviesService,
    private userMoviesService: UserMoviesService,
    private session: SessionService
  ) { }

  ngOnInit() {
    this.userMoviesService.getAllWatchedMovies(this.session.userId)
      .subscribe(
        res => {
          console.log(res)

          var moviesId = res.map(p => (
            p.movieId
          ));

          console.log(moviesId)

          this.moviesService.getAllWatchedMovies(moviesId)
            .subscribe(
              res => {
                console.log(res)

                this.filmes = res
              }, error => {
                console.log(error)
              }
            );

        }, error => {
          console.log(error)
        }
      )
  }

}
