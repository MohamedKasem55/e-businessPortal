import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { CARDS } from 'app/@core/constants/pages-urls-constants';
import { CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import { TransactionsListRequestModel } from 'app/@core/model/rest/cards/onwer-cards/transactions-list-models';
import { PrepaidCardsDetailsResponseModel } from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';
import { EMPTY, Observable, of } from 'rxjs';
import { CardDetailsFactoryService } from '../cards-shared/card-details-factory.service';
import { CardDetailsRouteStateModel } from '../cards-shared/card-details-route-state-model';

@Injectable()
export class CardDetailsResolver implements Resolve<any> {
  cardsTypes = CARD_TYPE;
  cardData!: {
    index: number;
    type: string;
    details: any;
  };

  constructor(
    private router: Router,
    private cardDetailsService: CardDetailsFactoryService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    const data = this.router.getCurrentNavigation()?.extras.state;
    if (data) {
      let cardRouteData: CardDetailsRouteStateModel = data;
      switch (cardRouteData.cardType) {
        case this.cardsTypes.BUSINESS:
          let cardList =
            await this.cardDetailsService.getUserBusinessCardsFromStore();
          let card =
            cardList[cardRouteData.cardIndex ? cardRouteData.cardIndex : 0];
          const cardDetails =
            await this.cardDetailsService.getBusinessCardDetails(card);
          cardRouteData.cardDetails = cardDetails;
          break;
        case this.cardsTypes.PREPAID:
          let prepaidcardList =
            await this.cardDetailsService.getUserPrepaidCardsFromStore();
          let prepaidcard =
            prepaidcardList[
              cardRouteData.cardIndex ? cardRouteData.cardIndex : 0
            ];
          const prepaidcardDetails =
            await this.cardDetailsService.getPrepaidCardDetails(prepaidcard);
          cardRouteData.cardDetails = prepaidcardDetails;
          break;
        case this.cardsTypes.OWNER:
          let ownercardList =
            await this.cardDetailsService.getUserOwnerCardsFromStore();
          let ownercard =
            ownercardList[
              cardRouteData.cardIndex ? cardRouteData.cardIndex : 0
            ];
          const ownercardDetails =
            await this.cardDetailsService.getOwnerCardDetails(ownercard);
          cardRouteData.cardDetails = ownercardDetails;

          const transactionsReq: TransactionsListRequestModel = {
            card: ownercard,
            order: '',
            orderType: 'desc',
            page: 1,
            rows: 50,
          };
          const ownercardTransactions =
            await this.cardDetailsService.getOwnerCardTransactions(
              transactionsReq
            );
          cardRouteData.transactionsListRes = ownercardTransactions;
          break;
        case this.cardsTypes.DEBIT:
          let debitcardList =
            await this.cardDetailsService.getUserDebitCardsFromStore();
          let debitcard =
            debitcardList[
              cardRouteData.cardIndex ? cardRouteData.cardIndex : 0
            ];

          cardRouteData.cardDetails = debitcard;
          break;
      }

      if (!cardRouteData.cardDetails) {
        this.router.navigateByUrl(`/${CARDS}`);
        return new Promise<Observable<never>>((resolve) => resolve(EMPTY));
      }

      return new Promise<Observable<CardDetailsRouteStateModel>>((resolve) =>
        resolve(of(cardRouteData))
      );
    }
  }
}
