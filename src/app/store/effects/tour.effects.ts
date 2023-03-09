import {Injectable} from '@angular/core';
import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import {tourActions} from '../actions/tour.actions';
import {QuestionService} from '../../services/question.service';
import {filter, map, switchMap} from 'rxjs/operators';
import {Question} from '../../models/question';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {selectTourLoadStatus} from '../selectors/tour.selectors';


@Injectable()
export class TourEffects {
  loadTour$ = createEffect(() => this.actions$.pipe(
    ofType(tourActions.loadTour),
    concatLatestFrom(() => this.store.select(selectTourLoadStatus)),
    filter(([, loadState]) => loadState === 'NOT_LOADED'),
    map(() => tourActions.initializeTour())
  ));

  initializeTour$ = createEffect(() => this.actions$.pipe(
    ofType(tourActions.initializeTour),
    switchMap(() => this.http.get<{ questions: Question[] }>('./assets/mock-tour.json')
      .pipe(
        map(({questions}) => tourActions.loadTourSuccess({questions})
        ))
    )
  ));

  constructor(private actions$: Actions, private questionService: QuestionService, private http: HttpClient, private store: Store) {
  }
}
