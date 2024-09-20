import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { TourEffects } from './tour.effects';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {provideMockStore} from "@ngrx/store/testing";

describe('TourEffects', () => {
  let actions$: Observable<any>;
  let effects: TourEffects;
  // let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TourEffects,
        provideMockActions(() => actions$),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(TourEffects);
    // httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
