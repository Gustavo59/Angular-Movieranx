import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Movie } from '../interfaces/movie';
import { MoviesService } from '../service/movies.service';
import { UserMoviesService } from '../service/user-movies.service';
import { SessionService } from '../service/session.service';
import * as $ from 'jquery';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { RouteGuardService } from '../service/route-guard.service';

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
  username = this.route.snapshot.paramMap.get('username');

  currentRate = 3.5;

  constructor(
    private moviesService: MoviesService,
    private userMoviesService: UserMoviesService,
    private session: SessionService,
    private route: ActivatedRoute,
    private routeGuard: RouteGuardService
  ) {
  }

  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get('username'))
    this.routeGuard.canAccess(this.route.snapshot.paramMap.get('username'))

    this.userMoviesService.getAllWatchedMovies(this.session.userId)
      .subscribe(
        res => {
          var moviesId = res.map(p => (
            p.movieId
          ));

          var moviesRatings = res.map(p => (
            (p.rating / 2)
          ));

          this.ratings = moviesRatings;

          this.moviesService.getAllWatchedMovies(moviesId)
            .subscribe(
              res => {
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
