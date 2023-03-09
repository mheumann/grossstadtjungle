import {createSelector} from '@ngrx/store';
import {AppState} from '../reducers';

export const selectTour = (state: AppState) => state.tour;
export const selectTourLoadStatus = createSelector(selectTour, tourState => tourState.loadState);
export const selectAllQuestions = createSelector(selectTour, tourState => tourState.allQuestions);
export const selectCurrentQuestion = createSelector(selectTour, tourState => tourState.currentQuestion);
export const selectFirstQuestionId = createSelector(selectTour, tourState => tourState.firstQuestionId);
