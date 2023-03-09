import {Question} from './question';

export interface TourState {
  loadState: 'NOT_LOADED' | 'LOADING' | 'LOADED';
  allQuestions: Question[];
  currentQuestion?: Question;
  firstQuestionId?: Question['id'];
}
