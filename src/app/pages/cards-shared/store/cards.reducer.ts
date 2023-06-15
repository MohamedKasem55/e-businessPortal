import { createFeatureSelector, createSelector, on } from '@ngrx/store';
import { createReducer } from '@ngrx/store';
import { CardsState } from './cards.state';
import * as CardsActions from './cards.action';

const initialState: CardsState = {
    creditCards : [],
    prepaidCards: [],
    businessCards: [],
    debitCards: [],
    selectedPrepaidDetails: null,
    selectedCreditDetails: null,
    selectedBusinessDetails: null,
    selectedDebitDetails: null,
    selectedCardIndex: null,
};

export const cardsReducer = createReducer<CardsState>(
  initialState,
  on(CardsActions.addOwnerCardsListAction, (state, { creditCards }) => {
    return { ...state, creditCards };
  }),
  on(CardsActions.addPrepaidCardsListAction, (state, { prepaidCards }) => {
    return { ...state, prepaidCards };
  }),
  on(CardsActions.addBusinessCardsListAction, (state, { businessCards }) => {
    return { ...state, businessCards };
  }),
  on(CardsActions.addDebitCardsListAction, (state, { debitCards }) => {
    return { ...state, debitCards };
  }),
  on(
    CardsActions.addPrepaidCardDetailsAction,
    (state, { prepaidDetails, index }) => {
      return {
        ...state,
        selectedPrepaidDetails: prepaidDetails,
        selectedCardIndex: index,
      };
    }
  ),
  on(
    CardsActions.addOwnerCardDetailsAction,
    (state, { creditDetails, index }) => {
      return {
        ...state,
        selectedCreditDetails: creditDetails,
        selectedCardIndex: index,
      };
    }
  )
);

export const getCreditCardsList = createSelector(
    createFeatureSelector<CardsState>('cards'),
    (state) => {
      return state.creditCards;
    }
);

export const getBusinessCardsList = createSelector(
  createFeatureSelector<CardsState>('cards'),
  (state) => {
    return state.businessCards;
  }
);

export const getDebitCardsList = createSelector(
  createFeatureSelector<CardsState>('cards'),
  (state) => {
    return state.debitCards;
  }
);

export const getPrepaidCardsList = createSelector(
    createFeatureSelector<CardsState>('cards'),
    (state) => {
      return state.prepaidCards;
    }
);

export const getSelectedCreditCardDetails = createSelector(
    createFeatureSelector<CardsState>('cards'),
    (state) => {
      return state.selectedCreditDetails;
    }
);

export const getSelectedPrepaidCardDetails = createSelector(
    createFeatureSelector<CardsState>('cards'),
    (state) => {
      return state.selectedPrepaidDetails;
    }
);

export const getSelectedCardIndex = createSelector(
    createFeatureSelector<CardsState>('cards'),
    (state) => {
      return state.selectedCardIndex;
    }
);
