import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MovieService } from '../service/movie.service';
import { UserMoviesService } from '../service/user-movies.service';
import { ActivatedRoute } from '@angular/router';
import { UserMovies } from '../interfaces/userMovies';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  title;
  genres;
  overview;
  posterPath;
  public watched: boolean = false;

  userMovies = <UserMovies>{};


  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private userMoviesService: UserMoviesService
  ) {
  }

  watchMovie() {
    if (this.watched) {
      this.watched = false
      this.userMovies.favorite = false
      this.userMovies.rating = 0

      this.deleteMovieRating()
    } else {
      this.watched = true

      this.sendMovieRate()
    }
  }

  favoriteMovie() {
    if (this.userMovies.favorite) {
      this.userMovies.favorite = false

      this.updateMovieRating()
    } else {
      this.userMovies.favorite = true

      if (this.watched) {
        this.updateMovieRating()
      } else {
        this.watched = true

        this.sendMovieRate()
      }

    }
  }

  rateMovie() {
    if (this.watched) {
      this.updateMovieRating()

    } else {
      this.watched = true

      this.sendMovieRate()
    }

  }

  ngOnInit() {
    this.userMovies.userId = localStorage.getItem("user");
    this.userMovies.movieId = this.route.snapshot.paramMap.get('id');

    this.userMovies.rating = 0

    this.movieService.getMovieData(this.userMovies.movieId)
      .subscribe(
        res => {
          console.log()

          this.title = res.original_title
          this.genres = res.genres
          this.overview = res.overview
          this.posterPath = "https://image.tmdb.org/t/p/w200" + res.poster_path

          this.userMoviesService.getUserMovieRating(localStorage.getItem("user"), this.userMovies.movieId)
            .subscribe(
              res => {
                if (res != null) {
                  this.userMovies.favorite = res.favorite
                  this.userMovies.rating = res.rating
                  this.watched = true
                  this.userMovies.id = res.id
                }
              }, error => {
                console.log(error)
              }
            )
        }, error => {
          console.log(error);
        }
      )
  }

  sendMovieRate() {
    this.userMoviesService.rateMovie(
      this.userMovies
    ).subscribe(
      res => {
        this.userMovies.id = res.id
        console.log(res)
      }, error => {
        console.log(error)
      }
    )
  }

  updateMovieRating() {
    this.userMoviesService.updateRating(
      this.userMovies,
      this.userMovies.id
    ).subscribe(
      res => {
        console.log(res)
      }, error => {
        console.log(error)
      }
    )
  }

  deleteMovieRating() {
    this.userMoviesService.deleteRating(
      this.userMovies.id
    ).subscribe(
      res => {
        console.log(res)
      }, error => {
        console.log(error)
      }
    )
  }

}
