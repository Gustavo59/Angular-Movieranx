import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SearchMovieComponent } from '../search-movie/search-movie.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @ViewChild('navBurger') navBurger: ElementRef;
  @ViewChild('navMenu') navMenu: ElementRef;

  public isLogged: boolean;

  movieName: string = '';
  username: string;

  constructor(
    public authenticationService: AuthenticationService,
    private sessionService: SessionService,
    private route: Router,
    private searchMovieComponent: SearchMovieComponent
  ) { }

  ngOnInit() {
    this.isLogged = this.userIsLogged();
  }

  searchMovie(searchMovieForm: NgForm) {
    this.searchMovieComponent.serchMovie(searchMovieForm.value.movieName);
  }

  toggleNavbar() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.navMenu.nativeElement.classList.toggle('is-active');
  }

  userIsLogged() {
    if (this.sessionService.getUserLogged() != null) {
      this.username = localStorage.getItem("username")
      return true;
    }
    return false;
  }

  logout() {
    this.sessionService.logout();
    location.reload();
    this.route.navigate(['']);
  }

}
