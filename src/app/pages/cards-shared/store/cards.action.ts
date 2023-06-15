import { createAction, props } from '@ngrx/store';
import { OwnerCardsListModel } from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import { PrepaidCardsListModel } from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import { OwnerCardDetailsModel } from 'app/@core/model/rest/cards/onwer-cards/details-res.model';
import { PrepaidCardDetailsModel } from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';
import { BusinessCardsListModel } from 'app/@core/model/rest/cards/business-cards/list-res.model';
import { BusinessCardsDetailsModel } from 'app/@core/model/rest/cards/business-cards/business-cards-models';
import { DebitCardsListModel } from 'app/@core/model/rest/cards/debit-cards/list-res.model';

export const ADD_OWNER_CARDS_LIST = '[Cards] add owner cards list';

export const ADD_PREPAID_CARDS_LIST = '[Cards] add prepaid cards list';

export const ADD_BUSINESS_CARDS_LIST = '[Cards] add business cards list';
export const ADD_DEBIT_CARDS_LIST = '[Cards] add debit cards list';

export const ADD_PREPAID_CARD_DETAILS = '[Cards] add selected prepaid card details';
export const ADD_OWNER_CARD_DETAILS = '[Cards] add selected owner card details';
export const ADD_BUSINESS_CARD_DETAILS = '[Cards] add selected business card details';
export const ADD_DEBIT_CARD_DETAILS = '[Cards] add selected debit card details';

export const addOwnerCardsListAction = createAction(
    ADD_OWNER_CARDS_LIST,
    props<{ creditCards: OwnerCardsListModel[] }>()
);

export const addPrepaidCardsListAction = createAction(
    ADD_PREPAID_CARDS_LIST,
    props<{ prepaidCards: PrepaidCardsListModel[] }>()
);

export const addDebitCardsListAction = createAction(
    ADD_DEBIT_CARDS_LIST,
    props<{ debitCards: DebitCardsListModel[] }>()
);

export const addBusinessCardsListAction = createAction(
    ADD_BUSINESS_CARDS_LIST,
    props<{ businessCards: BusinessCardsListModel[] }>()
);

export const addPrepaidCardDetailsAction = createAction(
    ADD_PREPAID_CARD_DETAILS,
    props<{ prepaidDetails: PrepaidCardDetailsModel, index: number }>()
);

export const addOwnerCardDetailsAction = createAction(
    ADD_OWNER_CARD_DETAILS,
    props<{ creditDetails: OwnerCardDetailsModel, index: number }>()
);

export const addBusinessCardDetailsAction = createAction(
    ADD_BUSINESS_CARD_DETAILS,
    props<{ businessDetails: BusinessCardsDetailsModel, index: number }>()
);