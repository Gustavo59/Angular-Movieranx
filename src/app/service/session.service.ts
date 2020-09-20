import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public userId: string;
  public username: string;

  constructor(private route: Router) { }

  getUserLogged() {
    const userId = localStorage.getItem('userId');

    if (!this.userId) {
      this.userId = userId;
    }

    return this.userId;
  }

  saveUserLoggedId(userId: string, username?: string) {
    localStorage.setItem('userId', userId)

    if (username != null) {
      this.username = username;
      localStorage.setItem('username', username);
    }

    this.userId = userId;
  }

  logout() {
    localStorage.clear();
    this.route.navigate(['']);
  }
}
