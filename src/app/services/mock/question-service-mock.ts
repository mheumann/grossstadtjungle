import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {TourLoadStatusEnum} from "../../enums/tour-load-status-enum";
import {Question} from "../../models/question";
import {TourStateEnum} from "../../enums/tour-state-enum";
import {LatLng} from "leaflet";

@Injectable()
export class QuestionServiceMock {
  tourLoadStatus$: Observable<TourLoadStatusEnum>;
  allQuestions$: Observable<Question[]>;
  currentQuestion$: Observable<Question>;
  tourState$: Observable<TourStateEnum>;

  constructor() {
    this.tourLoadStatus$ = of(TourLoadStatusEnum.notLoaded);
    this.allQuestions$ = of([]);
    this.currentQuestion$ = of({} as Question);
    this.tourState$ = of(TourStateEnum.started);
  }

  public loadTour() {
  }

  public setNextQuestion() {
  }

  public calculateClosestQuestion(_: LatLng) {
  }

  public isCorrectAnswer(_: string, __: Question['answers']): boolean {
    return true;
  }
}
