import {createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";
import * as AppState from "../../../@core/state/app-state";
import * as UserActions from "../state/action/user.action"

export interface State extends AppState.State {
  userToken: UserTokenState
}

export interface UserTokenState {
  token: string
}

const initialState: UserTokenState = {
  token: ''
}

export const getToken = createSelector(
  createFeatureSelector<UserTokenState>('pre-login'),
  (state) => {
    return state.token
  }
)

export const userReducer = createReducer<UserTokenState>(
  initialState,
  on(UserActions.saveToken, (state, {token}) => ({...state, token: token})),
  on(UserActions.deleteToken, (state) => ({...state, token: ""}))
)
