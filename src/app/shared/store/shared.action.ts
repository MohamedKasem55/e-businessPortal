import { createAction, props } from '@ngrx/store';

/**
 * shared store is created for any shared state between more than one module 
 */


export const ADD_USER_INFO_ACTION = '[Shared] add user info action';

export const ADD_PENDING_ACTIONS_ACTION = '[Shared] add pending actions action';


export const addUserInfoAction = createAction(
    ADD_USER_INFO_ACTION,
    props<{ userInfo: any }>()
);

export const addPendingActionsAction = createAction(
    ADD_PENDING_ACTIONS_ACTION,
    props<{ pendingActions: {[key: string]: number} }>()
);
