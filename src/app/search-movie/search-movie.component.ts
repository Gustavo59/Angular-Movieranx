import { Component, Input, NgZone, OnInit } from '@angular/core';
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

  filmes:Movie[] = null;
  filmesEmiiter$ = new BehaviorSubject<Movie[]>(this.filmes);

  constructor(
    private moviesService: MoviesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  serchMovie(term) {
    console.log("searching")
    this.router.navigate(['search'])

    term = term.replace(/ /g, "-")
    console.log(term)
    this.moviesService.findMoviesByTerm(term).subscribe(resp=>{
      console.log(resp)

      for(let filme of resp){
        console.log(filme.original_title)
      }
      this.filmes = resp
      this.filmesEmiiter$.next(this.filmes)
    })

  }
}
