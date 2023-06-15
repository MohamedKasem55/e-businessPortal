import { Injectable } from '@angular/core';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { Observable } from 'rxjs';
import {
  CardConfirmActivationReqeust,
  CardConfirmActivationRes,
  CardValidateActivateRequest,
  CardValidateActivateRes,
} from 'app/@core/model/rest/cards/cards-activation/cards-activation-models';
import { OwnerCardsListModel } from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import { Constants as OwnerConstants } from '../owner-cards/owner-cards-urls';

@Injectable()
export class CardsActivationService extends AbstractBaseService {
  validateCardActivate(
    activateReq: CardValidateActivateRequest,
    endpoint: string
  ): Observable<CardValidateActivateRes> {
    return this.post(endpoint, activateReq);
  }

  confirmCardActivate(
    req: CardConfirmActivationReqeust,
    endpoint: string
  ): Observable<CardConfirmActivationRes> {
    return this.post(endpoint, req);
  }

  activateOwnerCard(card: OwnerCardsListModel): Observable<any> {
    return this.post(OwnerConstants.OWNER_CARDS_ACTIVATION, { card });
  }
}
