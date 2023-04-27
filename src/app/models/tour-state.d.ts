import {Question} from './question';
import {TourLoadStatusEnum} from '../enums/tour-load-status-enum';

export interface TourState {
  loadState: TourLoadStatusEnum;
  allQuestions: Question[];
  currentQuestion?: Question;
  firstQuestionId?: Question['id'];
  answeredQuestionCount: number;
}
