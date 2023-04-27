import {createReducer, on} from '@ngrx/store';
import {tourActions} from '../actions/tour.actions';
import {TourState} from '../../models/tour-state';
import {TourLoadStatusEnum} from '../../enums/tour-load-status-enum';

export const initialState: TourState = {
  loadState: TourLoadStatusEnum.notLoaded,
  allQuestions: [],
  currentQuestion: null,
  firstQuestionId: null,
  answeredQuestionCount: 0
};

export const tourReducer = createReducer<TourState>(
    initialState,
    on(tourActions.initializeTour, (state): TourState => ({...state, loadState: TourLoadStatusEnum.loading})),
    on(tourActions.loadTourSuccess, (_, {questions}): TourState => ({
      ...initialState,
      allQuestions: questions,
      loadState: TourLoadStatusEnum.loaded
    })),
    on(tourActions.findNextQuestion, (state): TourState => {
      const answeredQuestionCount = state.answeredQuestionCount + 1;
      const nextQuestion = state.allQuestions.find(question => question.id === Number(state.currentQuestion.nextId));
      return {...state, currentQuestion: nextQuestion, answeredQuestionCount};
    }),
    on(tourActions.storeFirstQuestion, (state, {question}): TourState => ({
      ...state,
      currentQuestion: question,
      firstQuestionId: question.id
    })),
    on(tourActions.tourCompleted, (state): TourState => ({
      ...state,
      currentQuestion: null,
    }))
  )
;

