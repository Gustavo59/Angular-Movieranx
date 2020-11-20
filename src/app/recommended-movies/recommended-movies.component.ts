import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../interfaces/movie';
import { User } from '../interfaces/user';
import { MoviesService } from '../service/movies.service';
import { MovieService } from '../service/movie.service';
import { RouteGuardService } from '../service/route-guard.service';
import { SessionService } from '../service/session.service';
import { UserMoviesService } from '../service/user-movies.service';
import { ProfileService } from '../service/profile.service';
import { SimilarHighRatedMovie } from '../interfaces/similarHighRatedMovie';
import { forkJoin } from 'rxjs';
import { UserMovies } from '../interfaces/userMovies';
import { async } from 'rxjs/internal/scheduler/async';

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
  currentUserWatchedMovies: UserMovies[] = [];
  similarMovies: SimilarHighRatedMovie[] = [];
  allSimilarUsersWatchedMovies: UserMovies[] = [];
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
    private routeGuard: RouteGuardService,
    private profileService: ProfileService
  ) {}

  async ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.routeGuard.canAccess(this.route.snapshot.paramMap.get('username'));

    let imdbIds = this.getImdbIds();
    this.getMovies(imdbIds);
    this.getMovies(imdbIds).then((movies) => {
      this.filmes.push(...movies);
    });

    // colaborative recommendation
    this.userMoviesService
      .getAllWatchedMovies(this.session.userId)
      .subscribe((res) => {
        this.currentUserWatchedMovies = res;
        this.getCollaborativeRecommendationByMovies(
          this.currentUserWatchedMovies
        );
      });
  }

  getCollaborativeRecommendationByMovies(movies: UserMovies[]): Movie[] {
    let allSimilarHighRatedMovies: SimilarHighRatedMovie[] = [];
    //console.log('Current user watched movies:', this.currentUserWatchedMovies)
    this.getAllUsers().then((users) => {
      users.forEach((user) => {
        if (user.id != this.session.userId) {
          let userToCheck: User = user;
          this.getSimilarHighRatedMovies(
            userToCheck,
            this.currentUserWatchedMovies
          ).then((res) => {
            this.recommendColaborative();

            let userMovies: UserMovies[] = [];
            this.similarMovies.forEach((element) => {
              userMovies.push(element.movie);
            });
          });
        }
      });
    });
    return;
  }
  recommendColaborative() {
    this.allSimilarUsersWatchedMovies.forEach((movie) => {
      this.movieService.getMovieData(movie.movieId).then((res) => {
        let dupped = null;
        this.filmes.forEach((recommendedMovie) => {
          console.log(recommendedMovie, movie);
          if (recommendedMovie.id == movie.movieId) {
            dupped = true;
          } else {
            dupped = false;
          }
        });
        if (movie.rating >= 7 && !dupped) {
          console.log('res', res);
          this.filmes.push(res);
        }
      });
    });
  }

  async getSimilarHighRatedMovies(
    userToCheck: User,
    currentUserWatchedMovies: UserMovies[]
  ): Promise<SimilarHighRatedMovie[]> {
    let userToCheckSimilarMovies: SimilarHighRatedMovie[] = [];
    return new Promise(async (resolve) => {
      this.userMoviesService
        .getAllWatchedMovies(userToCheck.id)
        .subscribe((userToCheckWatchedMovies) => {
          if (userToCheckWatchedMovies.length > 0) {
            currentUserWatchedMovies.forEach((currentUserWatchedMovie) => {
              userToCheckWatchedMovies.forEach((userToCheckWatchedMovie) => {
                if (
                  currentUserWatchedMovie.movieId ==
                  userToCheckWatchedMovie.movieId
                ) {
                  userToCheckWatchedMovies.forEach((movie) => {
                    this.allSimilarUsersWatchedMovies.push(movie);
                  });
                  userToCheckSimilarMovies.push({
                    movie: userToCheckWatchedMovie,
                    user: userToCheck,
                  });
                }
              });
            });
          }
          if (userToCheckSimilarMovies.length > 0) {
            userToCheckSimilarMovies.forEach((element) => {
              this.similarMovies.push(element);
            });
            resolve(userToCheckSimilarMovies);
          }
        });
    });
  }

  async getAllUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      let allUsers: User[] = [];
      this.profileService.getAllUsers().subscribe((res) => {
        allUsers = res;
        resolve(allUsers);
      });
    });
  }

  async getMovies(imdbIds: Promise<string[]>): Promise<Movie[]> {
    return new Promise(async (resolve) => {
      let filmes: Movie[] = [];
      await imdbIds.then((imdbIds) => {
        for (const imdbId of imdbIds) {
          //console.log(imdbId)
          this.moviesService.getRecommendedMoviesByImdbId(imdbId).subscribe(
            (res) => {
              let idsObject: string[] = Object.values(res['imdb_id']);
              let ids: string[] = idsObject.splice(0, 5);
              this.moviesService.getAllMoviesByImdbId(ids).subscribe((data) => {
                data.forEach((element) => {
                  filmes.push(element);
                });
                resolve(filmes);
              });
            },
            (error) => {
              console.log(error);
            }
          );
        }
      });
    });
  }

  async getMoviesColaborative(imdbIds: string[]): Promise<Movie[]> {
    return new Promise(async (resolve) => {
      let filmes: Movie[] = [];
      console.log(imdbIds);
      for (const imdbId of imdbIds) {
        this.moviesService.getRecommendedMoviesByImdbId(imdbId).subscribe(
          (res) => {
            let idsObject: string[] = Object.values(res['imdb_id']);
            let ids: string[] = idsObject.splice(0, 3);
            this.moviesService.getAllMoviesByImdbId(ids).subscribe((data) => {
              console.log(data);
            });
          },
          (error) => {
            console.log(error);
          }
        );
        resolve(filmes);
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

  async getImdbIdsColaborative(movies: UserMovies[]): Promise<string[]> {
    let imdbIdList: string[] = [];
    return new Promise((resolve) => {
      for (const movie of movies) {
        this.movieService.getMovieData(movie.movieId).then((data) => {
          imdbIdList.push(data.imdb_id);
          console.log(imdbIdList);
        });
      }
      resolve(imdbIdList);
    });
  }
}
