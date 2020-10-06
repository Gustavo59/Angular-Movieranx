import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../interfaces/movie';
import { MoviesService } from '../service/movies.service';
import { MovieService } from '../service/movie.service';
import { RouteGuardService } from '../service/route-guard.service';
import { SessionService } from '../service/session.service';
import { UserMoviesService } from '../service/user-movies.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-recommended-movies',
  templateUrl: './recommended-movies.component.html',
  styleUrls: ['./recommended-movies.component.css'],
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
    private movieService: MovieService,
    private userMoviesService: UserMoviesService,
    private session: SessionService,
    private route: ActivatedRoute,
    private routeGuard: RouteGuardService
  ) {}

  async ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.routeGuard.canAccess(this.route.snapshot.paramMap.get('username'));
    this.getImdbIds().then((imdbIds) => {
      for (const imdbId of imdbIds) {
        this.moviesService.getRecommendedMoviesByImdbId(imdbId).subscribe(
          (res) => {  

            let ids:string[] = Object.values(res).splice(0,5);
            console.log(ids)
            this.moviesService.getAllMoviesByImdbId(ids).subscribe((data)=>{
              data.forEach(element => {
                this.filmes.push(element)
              });
            })
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  async getImdbIds(): Promise<string[]> {
    let imdbIdList: string[] = [];
    return new Promise((resolve) => {
      this.userMoviesService
        .getAllWatchedMovies(this.session.userId)
        .subscribe(async (movies) => {
          for (const movie of movies) {
            await this.movieService.getMovieData(movie.movieId).then((data) => {
              imdbIdList.push(data.imdb_id);
            });
          }
          resolve(imdbIdList);
        });
    });
  }
}
