import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import {environment} from '../../../environments/environment';
import {tourReducer} from './tour.reducer';
import {TourState} from '../../models/tour-state';

export interface AppState {
  tour: TourState;
}

export const reducers: ActionReducerMap<AppState> = {
  tour: tourReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
