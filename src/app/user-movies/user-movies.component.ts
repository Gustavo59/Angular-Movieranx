import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Movie } from '../interfaces/movie';
import { MoviesService } from '../service/movies.service';
import { UserMoviesService } from '../service/user-movies.service';
import { SessionService } from '../service/session.service';
import * as $ from 'jquery';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-movies',
  templateUrl: './user-movies.component.html',
  styleUrls: ['./user-movies.component.css']
})
export class UserMoviesComponent implements OnInit {

  filmes: Movie[] = [];
  ratings = [];
  page = 1;
  pageSize = 16;
  username = localStorage.getItem("username");

  currentRate = 3.5;

  constructor(
    private moviesService: MoviesService,
    private userMoviesService: UserMoviesService,
    private session: SessionService
  ) {
  }

  ngOnInit() {
    this.userMoviesService.getAllWatchedMovies(this.session.userId)
      .subscribe(
        res => {
          console.log("RELACIONAMENTOS: ", res)

          var moviesId = res.map(p => (
            p.movieId
          ));

          var moviesRatings = res.map(p => (
            (p.rating / 2)
          ));

          this.ratings = moviesRatings;

          console.log("MOVIES ID: ", moviesId)
          console.log("RATINGS: ", this.ratings)

          this.moviesService.getAllWatchedMovies(moviesId)
            .subscribe(
              res => {
                this.filmes = res

                console.log("FILMES: ", this.filmes)
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
