import { createFeatureSelector, createSelector, on } from '@ngrx/store';
import { createReducer } from '@ngrx/store';
import { SharedState } from './shared.state';
import * as SharedActions from './shared.action';

const initialState: SharedState = {
    userInfo : JSON.parse(sessionStorage.getItem('user')!) || null,
    pendingActions: undefined,
};

/**
 * shared store is created for any shared state between more than one module 
 */

export const sharedReducer = createReducer<SharedState>(
  initialState,
  on(SharedActions.addUserInfoAction, (state, { userInfo }) => {
    sessionStorage.setItem("user", JSON.stringify(userInfo));
    return { ...state, userInfo };
  }),
  on(SharedActions.addPendingActionsAction, (state, { pendingActions }) => {
    return { ...state, pendingActions };
  }),
);

export const getUserInfo = createSelector(
    createFeatureSelector<SharedState>('shared'),
    (state) => {
      return state.userInfo;
    }
);

export const getPendingActions = createSelector(
  createFeatureSelector<SharedState>('shared'),
  (state) => {
    return state.pendingActions;
  }
);

