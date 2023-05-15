import {Injectable} from '@angular/core';
import {Question} from '../models/question';
import {LatLng} from 'leaflet';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {distinctUntilChanged, filter, take, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {selectAllQuestions, selectCurrentQuestion} from '../store/selectors';
import {tourActions} from '../store/actions/tour.actions';
import {selectTourLoadStatus, selectTourState} from '../store/selectors/tour.selectors';
import {TourLoadStatusEnum} from '../enums/tour-load-status-enum';
import {TourStateEnum} from '../enums/tour-state-enum';

@Injectable({providedIn: 'root'})
export class QuestionService {
  tourLoadStatus$: Observable<TourLoadStatusEnum>;
  allQuestions$: Observable<Question[]>;
  currentQuestion$: Observable<Question>;
  tourState$: Observable<TourStateEnum>;

  constructor(private http: HttpClient, private store: Store) {
    this.tourLoadStatus$ = this.store.select(selectTourLoadStatus);
    this.allQuestions$ = this.store.select(selectAllQuestions).pipe(filter(questions => !!questions.length));
    this.currentQuestion$ = this.store.select(selectCurrentQuestion).pipe(distinctUntilChanged());
    this.tourState$ = this.store.select(selectTourState).pipe();
  }

  public loadTour() {
    this.store.dispatch(tourActions.loadTour());
  }

  public setNextQuestion(): void {
    this.store.dispatch(tourActions.findNextQuestion());
  }

  public calculateClosestQuestion(curPos: LatLng) {
    let closestQuestion: Question;
    let distance: number;
    let smallestDistance = 999999999;

    this.allQuestions$.pipe(
      take(1),
      tap(questions => {
        for (const question of questions) {
          distance = curPos.distanceTo(question.latLng);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestQuestion = question;
          }
        }

        this.store.dispatch(tourActions.storeCurrentQuestion({question: closestQuestion}));
      })).subscribe();
  }

  public isCorrectAnswer(userResponse: string, correctAnswers: Question['answers']): boolean {
    return correctAnswers.includes(userResponse.toLowerCase());
  }
}
