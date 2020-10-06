import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../interfaces/movie';
import { MoviesService } from '../service/movies.service';
import { RouteGuardService } from '../service/route-guard.service';
import { SessionService } from '../service/session.service';
import { UserMoviesService } from '../service/user-movies.service';

@Component({
  selector: 'app-recommended-movies',
  templateUrl: './recommended-movies.component.html',
  styleUrls: ['./recommended-movies.component.css']
})
export class RecommendedMoviesComponent implements OnInit {

  filmes: Movie[] = [];
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

    // this.userMoviesService.getAllSavedMovies(this.session.userId)
    //   .subscribe(
    //     res => {
    //       var moviesId = res.map(p => (
    //         p.movieId
    //       ));

    //       this.moviesService.getAllMoviesById(moviesId)
    //         .subscribe(
    //           res => {
    //             this.filmes = res
    //           }, error => {
    //             console.log(error)
    //           }
    //         );

    //     }, error => {
    //       console.log(error)
    //     }
    //   )
  }

}
