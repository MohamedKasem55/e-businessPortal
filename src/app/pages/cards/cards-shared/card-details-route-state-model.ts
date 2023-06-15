import { BusinessCardsDetailsModel, BusinessCardsDetailsResponse } from "app/@core/model/rest/cards/business-cards/business-cards-models";
import { DebitCardApplyNewCardInitRes, DebitCardPOSLimitsRes, DebitCardsListModel } from "app/@core/model/rest/cards/debit-cards/list-res.model";
import { OwnerCardDetailsModel, OwnerCardDetailsResponseModel } from "app/@core/model/rest/cards/onwer-cards/details-res.model";
import { OwnerCardTransactionsListRes } from "app/@core/model/rest/cards/onwer-cards/transactions-list-models";
import { PrepaidCardDetailsModel, PrepaidCardsDetailsResponseModel } from "app/@core/model/rest/cards/prepaid-cards/details-res.model";

export interface CardDetailsRouteStateModel {
    cardDetails?: BusinessCardsDetailsResponse | PrepaidCardsDetailsResponseModel | OwnerCardDetailsResponseModel | DebitCardsListModel
    cardType?: string,
    cardIndex?: number,
    transactionsListRes?: OwnerCardTransactionsListRes
}

export interface CardResetPinRouteStateModel {
    cardDetails?: BusinessCardsDetailsModel | PrepaidCardDetailsModel | OwnerCardDetailsModel | DebitCardsListModel
    cardType?: string,
    cardIndex?: number
}

export interface CardBlockRouteStateModel {
    cardDetails?: BusinessCardsDetailsModel | DebitCardsListModel| undefined
    operationType?: string,
}

export interface CardConfigurationRouteStateModel {
    cardDetails?: DebitCardsListModel | undefined
    debitCardPOSLimitsRes?: DebitCardPOSLimitsRes | undefined,
}

export interface DebitCardApplyNewRouteStateModel {
    debitCardApplyNewCardInitRes?: DebitCardApplyNewCardInitRes | undefined
}