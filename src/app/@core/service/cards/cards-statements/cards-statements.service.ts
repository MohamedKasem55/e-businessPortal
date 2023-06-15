import {Injectable} from '@angular/core';
import {AbstractBaseService, ContextPath, RequestOption} from '../../base/abstract-base.service';
import { Constants as OwnerConstants } from '../owner-cards/owner-cards-urls';
import { Constants as PrepaidConstants } from '../prepaid-cards/prepaid-cards-urls';
import { Constants as BusinessConstants } from '../business-cards/business-cards-urls';
import { CardStatementsRequest } from 'app/@core/model/rest/cards/common/statements-list-models';
import { Observable } from 'rxjs';



@Injectable()
export class CardsStatementsService extends AbstractBaseService {
 
  getPrepaidCardStatements(
    request: CardStatementsRequest
  ): Observable<any> {
    return this.post(PrepaidConstants.PREPAID_CARDS_STATEMENTS_LIST, request);
  }

  getOwnerCardStatements(
    request: CardStatementsRequest
  ): Observable<any> {
    return this.post(OwnerConstants.OWNER_CARDS_STATEMENTS_LIST, request);
  }

  getBusinessCardStatements(
    request: CardStatementsRequest
  ): Observable<any> {
    return this.post(BusinessConstants.BUSINESS_CARDS_STATEMENTS_LIST, request);
  }
}
