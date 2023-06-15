import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { CARDS } from 'app/@core/constants/pages-urls-constants';
import { CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import {
  DebitCardPOSLimitsRequest,
  DebitCardsListModel,
} from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import { DebitCardsService } from 'app/@core/service/cards/debit-cards/debit-cards.service';
import { catchError, EMPTY, mergeMap, Observable, of, take } from 'rxjs';
import { CardDetailsFactoryService } from '../cards-shared/card-details-factory.service';
import { CardConfigurationRouteStateModel, CardDetailsRouteStateModel } from '../cards-shared/card-details-route-state-model';

@Injectable()
export class CardConfigurationResolver implements Resolve<CardConfigurationRouteStateModel> {
  cardsTypes = CARD_TYPE;
  cardData!: {
    index: number;
    type: string;
    details: any;
  };

  constructor(
    private router: Router,
    private debitCardsService: DebitCardsService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CardConfigurationRouteStateModel> | Observable<never> {
    const data : CardConfigurationRouteStateModel = this.router.getCurrentNavigation()?.extras.state as CardConfigurationRouteStateModel;
    if (!data) {
      this.router.navigateByUrl(`/${CARDS}`);
      return EMPTY
    };

    let cardRouteData: DebitCardsListModel = data.cardDetails as DebitCardsListModel;
    const req: DebitCardPOSLimitsRequest = {
      cardNumber: cardRouteData.cardNum,
      cardSeqNumber: cardRouteData.cardSeqNum,
    };
    return this.debitCardsService.getDebitCardPOSLimits(req).pipe(
      take(1),
      mergeMap((res) => {
        if (res) {
          let routeNewState : CardConfigurationRouteStateModel = {
            cardDetails: cardRouteData,
            debitCardPOSLimitsRes: res
          }
          return of(routeNewState);
        }
        this.router.navigateByUrl(`/${CARDS}`);
        return EMPTY;
      }),
      catchError((error) => {
        this.router.navigateByUrl(`/${CARDS}`);
        return EMPTY;
      })
    );
  }
}
