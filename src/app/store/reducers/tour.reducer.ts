import {createReducer, on} from '@ngrx/store';
import {tourActions} from '../actions/tour.actions';
import {TourState} from '../../models/tour-state';

export const initialState: TourState = {
  loadState: 'NOT_LOADED',
  allQuestions: [],
  currentQuestion: null,
  firstQuestionId: null,
  answeredQuestionCount: 0
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
      const answeredQuestionCount = state.answeredQuestionCount + 1;
      const nextQuestion = state.allQuestions[
        (state.currentQuestion.id + 1) % state.allQuestions.length
        ];
      return {...state, currentQuestion: nextQuestion, answeredQuestionCount};
    }),
    on(tourActions.storeFirstQuestion, (state, {question}): TourState => ({
      ...state,
      currentQuestion: question,
      firstQuestionId: question.id
    }))
  )
;

