import { Component, Input, NgZone, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../interfaces/movie';
import { MovieService } from '../service/movie.service';

@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent implements OnInit {

  filmes;
  contador = 1;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  serchMovie(name) {
    this.router.navigate(['search'])

    name = name.replace(/ /g, "-")

    this.movieService.searchMoviesByName(name)
      .subscribe(
        res => {
          this.filmes = res;
          this.contador = 2;
          console.log(this.filmes)
        }, error => {
          console.log(error);
        }
      )
  }
}
