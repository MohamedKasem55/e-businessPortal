import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { APPLY_NEW_CARD, CARDS } from 'app/@core/constants/pages-urls-constants';
import { CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import { DebitCardApplyNewCardInitRes } from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import { DebitCardsService } from 'app/@core/service/cards/debit-cards/debit-cards.service';
import { catchError, EMPTY, mergeMap, Observable, of, take } from 'rxjs';
import {Utils} from "../../../@core/utility/Utils";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

@Injectable()
export class DebitCardApplyNewResolver
  implements Resolve<DebitCardApplyNewCardInitRes>
{
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
  ): Observable<DebitCardApplyNewCardInitRes> | Observable<never> {
    let canProceed = AuthenticationUtils.hasAccess('RequestNewDebitCard');

    if (!canProceed) {
      this.router.navigate([`/${CARDS}/${APPLY_NEW_CARD}`]);
      return EMPTY;
    }

    return this.debitCardsService.initDebitApplyNewCard().pipe(
      take(1),
      mergeMap((res) => {
        if (res) {
          return of(res);
        }
        this.router.navigate([`/${CARDS}/${APPLY_NEW_CARD}`]);
        return EMPTY;
      }),
      catchError((error) => {
        this.router.navigate([`/${CARDS}/${APPLY_NEW_CARD}`]);
        return EMPTY;
      })
    );
  }
}
