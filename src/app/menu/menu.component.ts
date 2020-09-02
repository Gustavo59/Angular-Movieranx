import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @ViewChild('navBurger') navBurger: ElementRef;
  @ViewChild('navMenu') navMenu: ElementRef;

  public isLogged: boolean;

  constructor(
    public authenticationService: AuthenticationService,
    private sessionService: SessionService,
    private route: Router
  ) { }

  ngOnInit() {
    this.isLogged = this.userIsLogged();
  }

  toggleNavbar() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.navMenu.nativeElement.classList.toggle('is-active');
  }

  userIsLogged() {
    if (this.sessionService.getUserLogged() != null) {
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
