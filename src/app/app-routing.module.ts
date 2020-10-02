import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { MovieComponent } from './movie/movie.component';
import { SearchMovieComponent } from './search-movie/search-movie.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { WatchedMoviesComponent } from './watched-movies/watched-movies.component';
import { RouteGuardService } from './service/route-guard.service'
import { SavedMoviesComponent } from './saved-movies/saved-movies.component';
import { RecommendedMoviesComponent } from './recommended-movies/recommended-movies.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'movie/:id', component: MovieComponent },
  { path: 'search', component: SearchMovieComponent },
  { path: ':username/profile/edit', component: EditProfileComponent, canActivate: [RouteGuardService] },
  { path: ':username/movies/watched', component: WatchedMoviesComponent, canActivate: [RouteGuardService] },
  { path: ':username/movies/saved', component: SavedMoviesComponent, canActivate: [RouteGuardService] },
  { path: ':username/movies/recommended', component: RecommendedMoviesComponent, canActivate: [RouteGuardService] },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
