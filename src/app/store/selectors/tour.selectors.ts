import {createSelector} from '@ngrx/store';
import {AppState} from '../reducers';
import {TourStateEnum} from '../../enums/tour-state-enum';

export const selectTour = (state: AppState) => state.tour;
export const selectTourLoadStatus = createSelector(selectTour, tour => tour.loadState);
export const selectAllQuestions = createSelector(selectTour, tour => tour.allQuestions);
export const selectCurrentQuestion = createSelector(selectTour, tour => tour.currentQuestion);
export const selectFirstQuestionId = createSelector(selectTour, tour => tour.firstQuestionId);
export const selectAnsweredQuestionCount = createSelector(selectTour, tour => tour.answeredQuestionCount);
export const selectQuestionCounters = createSelector(selectAllQuestions, selectAnsweredQuestionCount,
  (questions, answeredQuestionsCount) => ({
    total: questions.length,
    current: answeredQuestionsCount
  }));

export const selectTourState = createSelector(selectQuestionCounters,
  ({total, current}) => (current > 0) ? ((current < total) ? TourStateEnum.running : TourStateEnum.completed) : TourStateEnum.started);
