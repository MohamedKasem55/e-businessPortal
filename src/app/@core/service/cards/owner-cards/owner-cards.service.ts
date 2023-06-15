import {Injectable} from '@angular/core';
import {AbstractBaseService} from '../../base/abstract-base.service';
import {Constants} from './owner-cards-urls';
import {Observable} from 'rxjs';
import {
  CardsListResponseModel,
  OwnerCardsListModel,
} from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import {OwnerCardDetailsResponseModel} from 'app/@core/model/rest/cards/onwer-cards/details-res.model';
import {
  TransactionsListRequestModel,
  OwnerCardTransactionsListRes
} from 'app/@core/model/rest/cards/onwer-cards/transactions-list-models';

@Injectable()
export class OwnerCardsService extends AbstractBaseService {
  getOwnerCardsList(
    page: number,
    row: number,
    isSilentError: boolean = false
  ): Observable<CardsListResponseModel> {
    return this.post(
      Constants.OWNER_CARDS_LIST,
      {page, row},
      {hideLoader: true, silentError: isSilentError}
    );
  }

  getOwnerCardDetails(
    card: OwnerCardsListModel
  ): Observable<OwnerCardDetailsResponseModel> {
    return this.post(Constants.OWNER_CARDS_DETAILS, {card});
  }

  getOwnerCardTransactions(
    req: TransactionsListRequestModel
  ): Observable<OwnerCardTransactionsListRes> {
    return this.post(Constants.OWNER_CARDS_TRANSACTIONS, req);
  }

  cancelCard(card: OwnerCardsListModel): Observable<any> {
    return this.post(Constants.OWNER_CARDS_CANCELATION, {card});
  }
}
