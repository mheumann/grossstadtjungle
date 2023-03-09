import {createReducer, on} from '@ngrx/store';
import {tourActions} from '../actions/tour.actions';
import {TourState} from '../../models/tour-state';

export const initialState: TourState = {
  loadState: 'NOT_LOADED',
  allQuestions: [],
  currentQuestion: null,
  firstQuestionId: null
};

export const tourReducer = createReducer<TourState>(
    initialState,
    on(tourActions.initializeTour, (state): TourState => ({...state, loadState: 'LOADING'})),
    on(tourActions.loadTourSuccess, (_, {questions}): TourState => ({
      ...initialState,
      allQuestions: questions,
      loadState: 'LOADED'
    })),
    on(tourActions.findNextQuestion, (state): TourState => {
      const currQuestionId = state.currentQuestion.id;
      const nextQuestion = ((currQuestionId + 1) === state.allQuestions.length) ?
        state.allQuestions[0] : state.allQuestions[currQuestionId + 1];
      return {...state, currentQuestion: nextQuestion};
    }),
    on(tourActions.storeFirstQuestion, (state, {question}): TourState => ({
      ...state,
      currentQuestion: question,
      firstQuestionId: question.id
    }))
  )
;

