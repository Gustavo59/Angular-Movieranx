import { Component, OnInit } from '@angular/core';
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

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id');

    this.movieService.getMovieData(this.movieId)
      .subscribe(
        res => {
          console.log(res)
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
