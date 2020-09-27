import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
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
  favorited = [];
  page = 1;
  pageSize = 16;
  username = this.route.snapshot.paramMap.get('username');
  public innerWidth: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth)
    if (this.innerWidth <= 1600 && this.innerWidth >= 1410) {
      this.pageSize = 16;
    } else if (this.innerWidth < 1025 && this.innerWidth >= 992) {
      this.pageSize = 10;
    } else if (this.innerWidth < 992 && this.innerWidth >= 768) {
      this.pageSize = 18;
    } else if (this.innerWidth < 768 && this.innerWidth >= 425) {
      this.pageSize = 16;
    } else if (this.innerWidth < 425 && this.innerWidth >= 375) {
      this.pageSize = 16;
    } else if (this.innerWidth < 375) {
      this.pageSize = 12;
    }
  }

  constructor(
    private moviesService: MoviesService,
    private userMoviesService: UserMoviesService,
    private session: SessionService,
    private route: ActivatedRoute,
    private routeGuard: RouteGuardService
  ) {
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;

    this.routeGuard.canAccess(this.route.snapshot.paramMap.get('username'))

    this.userMoviesService.getAllWatchedMovies(this.session.userId)
      .subscribe(
        res => {
          var moviesId = res.map(p => (
            p.movieId
          ));

          this.ratings = res.map(p => (
            (p.rating / 2)
          ));

          this.favorited = res.map(p => (
            p.favorite
          ));

          console.log(this.favorited)

          this.moviesService.getAllWatchedMovies(moviesId)
            .subscribe(
              res => {
                for (let index = 0; index < 5; index++) {
                  for (let index = 0; index < res.length; index++) {
                    this.filmes.push(res[index])

                  }

                }
                // this.filmes = res
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
