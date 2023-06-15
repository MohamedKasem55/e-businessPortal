import { PrepaidCardDetailsModel } from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';
import { OwnerCardsListModel } from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import { PrepaidCardsListModel } from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import { BusinessCardsListModel } from 'app/@core/model/rest/cards/business-cards/list-res.model';
import { BusinessCardsDetailsResponse } from 'app/@core/model/rest/cards/business-cards/business-cards-models';
import { OwnerCardDetailsModel } from 'app/@core/model/rest/cards/onwer-cards/details-res.model';
import { DebitCardsListModel } from 'app/@core/model/rest/cards/debit-cards/list-res.model';

export interface CardsState {
    creditCards: OwnerCardsListModel[],
    prepaidCards: PrepaidCardsListModel[],
    businessCards: BusinessCardsListModel[],
    debitCards: DebitCardsListModel[],
    selectedPrepaidDetails: PrepaidCardDetailsModel | null,
    selectedCreditDetails: OwnerCardDetailsModel | null,
    selectedBusinessDetails: BusinessCardsDetailsResponse | null,
    selectedDebitDetails: BusinessCardsDetailsResponse | null,
    selectedCardIndex: number | null,
}