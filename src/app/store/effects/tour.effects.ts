import {Injectable} from '@angular/core';
import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import {tourActions} from '../actions/tour.actions';
import {QuestionService} from '../../services/question.service';
import {filter, map, switchMap} from 'rxjs/operators';
import {Question} from '../../models/question';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {selectTourLoadStatus, selectTourState} from '../selectors/tour.selectors';
import {TourStateEnum} from '../../enums/tour-state-enum';
import {TourLoadStatusEnum} from '../../enums/tour-load-status-enum';


@Injectable()
export class TourEffects {
  loadTour$ = createEffect(() => this.actions$.pipe(
    ofType(tourActions.loadTour),
    concatLatestFrom(() => this.store.select(selectTourLoadStatus)),
    filter(([, loadState]) => loadState === TourLoadStatusEnum.notLoaded),
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

  findNextQuestion$ = createEffect(() => this.actions$.pipe(
    ofType(tourActions.findNextQuestion),
    concatLatestFrom(() => this.store.select(selectTourState)),
    filter(([, tourState]) => tourState === TourStateEnum.completed),
    map(() => tourActions.tourCompleted())
  ));

  constructor(private actions$: Actions, private questionService: QuestionService, private http: HttpClient, private store: Store) {
  }
}
