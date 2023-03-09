import {createAction, props} from '@ngrx/store';
import {Question} from '../../models/question';

export const loadTour = createAction(
  '[Tour] Load Tour'
);

export const initializeTour = createAction(
  '[Tour] Initialize Tour'
);

export const loadTourSuccess = createAction(
  '[Tour] Load Tour Success',
  props<{ questions: Question[] }>()
);

export const loadTourFailure = createAction(
  '[Tour] Load Tour Failure',
  props<{ error: any }>()
);

export const storeFirstQuestion = createAction(
  '[Tour] Store Current Question',
  props<{ question: Question }>()
);

export const findNextQuestion = createAction(
  '[Tour] Find Next Question'
);

export const tourActions = {
  initializeTour,
  loadTour,
  loadTourSuccess,
  loadTourFailure,
  storeFirstQuestion,
  findNextQuestion
};
