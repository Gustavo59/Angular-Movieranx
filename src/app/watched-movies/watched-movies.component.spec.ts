import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchedMoviesComponent } from './watched-movies.component';

describe('UserMoviesComponent', () => {
  let component: WatchedMoviesComponent;
  let fixture: ComponentFixture<WatchedMoviesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WatchedMoviesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchedMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
