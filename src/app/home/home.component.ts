import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../service/movies.service';
import { Movie } from '../interfaces/movie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit{

  
  filmes: Movie[]

  constructor(
    private moviesService: MoviesService
  ) { }

  ngOnInit(){
    this.moviesService.getPopularMoviesByGenre("Comedy").subscribe(data =>{
      this.filmes = data
      console.log("http://image.tmdb.org/t/p/w200"+data[0].poster_path)
    } ); 
  }
}
