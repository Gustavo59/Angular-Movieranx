import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  filmes: any = [];

  constructor() { }

  ngOnInit() {
    this.getPopularFilmes()
  }

  getPopularFilmes() {
    this.filmes = [
      {
        "src": "../../assets/image-not-found.png",
        "name": "Batman",
        "year": 2008
      },
      {
        "src": "../../assets/image-not-found.png",
        "name": "Lord of the Rings",
        "year": 2001
      },
      {
        "src": "../../assets/image-not-found.png",
        "name": "Amour",
        "year": 2012
      },
      {
        "src": "../../assets/image-not-found.png",
        "name": "Memento",
        "year": 2000
      },
      {
        "src": "../../assets/image-not-found.png",
        "name": "Moonlight",
        "year": 2016
      }
    ]
  }

}
