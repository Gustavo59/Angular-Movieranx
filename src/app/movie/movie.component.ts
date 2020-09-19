import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MovieService } from '../service/movie.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  movieId;
  title;
  genres;
  overview;
  posterPath;
  currentRate = 0;
  public watched: boolean = false;
  public favorited: boolean = false;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute
  ) { }

  watchMovie() {
    if (this.watched) {
      this.watched = false
    } else {
      this.watched = true
    }
  }

  favoriteMovie() {
    if (this.favorited) {
      this.favorited = false
    } else {
      this.favorited = true
    }
  }

  rateMovie(rating) {
    if (rating > 0) {
      this.watched = true
    } else {
      this.watched = false
      this.favorited = false
    }

  }

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id');

    this.movieService.getMovieData(this.movieId)
      .subscribe(
        res => {
          this.title = res.original_title
          this.genres = res.genres
          this.overview = res.overview
          this.posterPath = "https://image.tmdb.org/t/p/w200" + res.poster_path
        }, error => {
          console.log(error);
        }
      )
  }

}
