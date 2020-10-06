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


  constructor(
    private moviesService: MoviesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  public name1 = "antes";
  public name2 = "antes";
  

  @Input('movies-returned') filmes:Movie[];
  @Input("search-term") term :string;

  ngOnInit() {
    this.route.queryParams.subscribe(params=>{
      let term = params.term
      try{ 
        term = term.replace(/ /g, "-")
         this.moviesService.findMoviesByTerm(term).then(
        data =>{
        console.log(data)
        this.filmes = data
        return data
      })
      }catch(e){
        console.log(e)
      }
  


    })
  }

  async serchMovie(term:string) { 
  
 
  }
}
