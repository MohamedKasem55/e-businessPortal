import {createAction, props} from "@ngrx/store";
import {UserTokenState} from "../user.reducer";


export const SAVE_TOKEN = '[User] Save Token';

export const DELETE_TOKEN = '[User] Delete Token';


export const saveToken = createAction(SAVE_TOKEN, props<UserTokenState>());

export const deleteToken = createAction(DELETE_TOKEN);
