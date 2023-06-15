import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import {
  BusinessCardsDetailsModel,
  BusinessCardsDetailsRequest,
  BusinessCardsDetailsResponse,
} from 'app/@core/model/rest/cards/business-cards/business-cards-models';
import { PrepaidCardDetailsRequestModel } from 'app/@core/model/rest/cards/prepaid-cards/details-req.model';
import { PrepaidCardsDetailsResponseModel } from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';
import { BusinessCardsService } from 'app/@core/service/cards/business-cards/business-cards.service';
import { OwnerCardDetailsResponseModel } from 'app/@core/model/rest/cards/onwer-cards/details-res.model';
import { OwnerCardsListModel } from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import { PrepaidCardsListModel } from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import { OwnerCardsService } from 'app/@core/service/cards/owner-cards/owner-cards.service';
import { PrepaidCardsService } from 'app/@core/service/cards/prepaid-cards/prepaid-cards.service';
import { lastValueFrom, map, take } from 'rxjs';
import {
  getCreditCardsList,
  getPrepaidCardsList,
  getBusinessCardsList,
  getDebitCardsList,
} from '../../cards-shared/store/cards.reducer';
import { CardDetailsRouteStateModel } from './card-details-route-state-model';
import { BusinessCardsListModel } from 'app/@core/model/rest/cards/business-cards/list-res.model';
import { DebitCardsListModel } from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import {
  TransactionsListRequestModel,
  OwnerCardTransactionsListRes,
} from 'app/@core/model/rest/cards/onwer-cards/transactions-list-models';

export interface UserCardsLists {
  creditCards: OwnerCardsListModel[];
  prepaidCards: PrepaidCardsListModel[];
}

@Injectable()
export class CardDetailsFactoryService {
  cardsTypes = CARD_TYPE;
  cardRouteData: CardDetailsRouteStateModel = {};

  constructor(
    private router: Router,
    private store: Store,
    private businessCardsService: BusinessCardsService,
    private ownerCardsService: OwnerCardsService,
    private prepaidCardsService: PrepaidCardsService
  ) {}

  async getUserOwnerCardsFromStore(): Promise<OwnerCardsListModel[]> {
    let creditCards: OwnerCardsListModel[] = await lastValueFrom(
      this.store.select(getCreditCardsList).pipe(take(1))
    );

    return new Promise<OwnerCardsListModel[]>((resolve) =>
      resolve(creditCards)
    );
  }

  async getUserBusinessCardsFromStore(): Promise<BusinessCardsListModel[]> {
    let businessCards: BusinessCardsListModel[] = await lastValueFrom(
      this.store.select(getBusinessCardsList).pipe(take(1))
    );

    return new Promise<BusinessCardsListModel[]>((resolve) =>
      resolve(businessCards)
    );
  }

  async getUserPrepaidCardsFromStore(): Promise<PrepaidCardsListModel[]> {
    let prepaidCards: PrepaidCardsListModel[] = await lastValueFrom(
      this.store.select(getPrepaidCardsList).pipe(take(1))
    );

    return new Promise<PrepaidCardsListModel[]>((resolve) =>
      resolve(prepaidCards)
    );
  }

  async getUserDebitCardsFromStore(): Promise<DebitCardsListModel[]> {
    let debitCards: DebitCardsListModel[] = await lastValueFrom(
      this.store.select(getDebitCardsList).pipe(take(1))
    );

    return new Promise<DebitCardsListModel[]>((resolve) => resolve(debitCards));
  }

  async isValidCardsListItem(cardType: string, cardIndex: number) {
    let cardsList;
    switch (cardType) {
      case this.cardsTypes.OWNER:
        cardsList = await lastValueFrom(
          this.store.select(getCreditCardsList).pipe(take(1))
        );
        break;
      case this.cardsTypes.PREPAID:
        cardsList = await lastValueFrom(
          this.store.select(getPrepaidCardsList).pipe(take(1))
        );
        break;
      default:
        break;
    }
    if (cardsList) {
      return cardsList[cardIndex] || false;
    }
    return false;
  }

  async getOwnerCardDetails(
    card: OwnerCardsListModel
  ): Promise<OwnerCardDetailsResponseModel | undefined> {
    try {
      const cardDetails = await lastValueFrom(
        this.ownerCardsService.getOwnerCardDetails(card).pipe(take(1))
      );
      return cardDetails;
    } catch (error) {
      return undefined;
    }
  }

  async getOwnerCardTransactions(
    req: TransactionsListRequestModel
  ): Promise<OwnerCardTransactionsListRes | undefined> {
    try {
      const cardDetails = await lastValueFrom(
        this.ownerCardsService.getOwnerCardTransactions(req).pipe(take(1))
      );
      return cardDetails;
    } catch (error) {
      return undefined;
    }
  }

  async getBusinessCardDetails(
    card: BusinessCardsListModel
  ): Promise<BusinessCardsDetailsResponse | undefined> {
    try {
      const request: BusinessCardsDetailsRequest = {
        cardSeqNumber: card.cardSeqNumber,
        cardNumber: card.cardNumber,
        details: true,
        rows: 20,
        page: 0,
      };
      const cardDetails = await lastValueFrom(
        this.businessCardsService.getBusinessCardDetails(request).pipe(take(1))
      );
      return cardDetails;
    } catch (error) {
      return undefined;
    }
  }

  async getPrepaidCardDetails(
    card: PrepaidCardsListModel
  ): Promise<PrepaidCardsDetailsResponseModel | undefined> {
    try {
      const request: PrepaidCardDetailsRequestModel = {
        cardSeqNumber: card.cardSeqNumber,
        rows: 20,
        page: 0,
      };
      const cardDetails = await lastValueFrom(
        this.prepaidCardsService.getPrepaidCardsDetails(request).pipe(take(1))
      );
      return cardDetails;
    } catch (error) {
      return undefined;
    }
  }
}
