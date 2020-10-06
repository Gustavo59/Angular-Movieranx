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
  pageSize = 16;
  public innerWidth: any;

  constructor(
    private moviesService: MoviesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }



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
  

  ngOnInit() {
    this.innerWidth = window.innerWidth;
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
