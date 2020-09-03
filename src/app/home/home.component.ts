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
      "../../assets/image-not-found.png",
      "../../assets/image-not-found.png",
      "../../assets/image-not-found.png",
      "../../assets/image-not-found.png",
      "../../assets/image-not-found.png"
    ]
  }

}
