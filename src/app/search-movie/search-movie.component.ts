import { Component, HostListener, Input, NgZone, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../interfaces/movie';
import { MoviesService } from '../service/movies.service';

@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent implements OnInit {
  filmes: Movie[] = [];
  page = 1;
  pageSize = 5;
  public innerWidth: any;
  movieSearched;

  constructor(
    private moviesService: MoviesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.route.queryParams.subscribe(params => {
      let term = params.term

      this.movieSearched = term

      try {
        term = term.replace(/ /g, "-")
        this.moviesService.findMoviesByTerm(term).then(
          data => {
            console.log(data)
            this.filmes = data
            return data
          })
      } catch (e) {
        console.log(e)
      }

    })
  }

  async serchMovie(term: string) {


  }
}
