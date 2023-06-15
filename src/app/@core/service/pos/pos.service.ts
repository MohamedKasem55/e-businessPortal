import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExternalAppTokenRes } from 'app/@core/model/rest/pos/external-app/external-app-token-res';
import {
  POSNewRequestConfirmReq,
  POSNewRequestConfirmRes,
  POSNewRequestValidateRes,
} from 'app/@core/model/rest/pos/new-req/new-request-res';
import { POSTerminalsRequestRes } from 'app/@core/model/rest/pos/new-req/terminals-request-res';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../base/abstract-base.service';
import { POS_SVC_URL_CONST } from './pos-service-url';

@Injectable( )
export class POSService extends AbstractBaseService {
  validateRequest(validateReq: FormData): Observable<POSNewRequestValidateRes> {
    return this.post(POS_SVC_URL_CONST.VALD_NEW_REQ, validateReq, {
      customHeaders: new HttpHeaders()
        .set('Accept', 'application/json, text/plain, */*')
        .set('Content-Type', 'multipart/form-data'),
    });
  }

  confirmRequest(
    request: POSNewRequestConfirmReq
  ): Observable<POSNewRequestConfirmRes> {
    return this.post(POS_SVC_URL_CONST.CONF_NEW_REQ, request);
  }

  searchTerminals(): Observable<POSTerminalsRequestRes> {
    return this.get(POS_SVC_URL_CONST.SEARCH_TERMINALS);
  }

  validatetTerminalRequest(
    validateReq: FormData
  ): Observable<POSNewRequestValidateRes> {
    return this.post(POS_SVC_URL_CONST.VALD_TERMINAL_REQ, validateReq, {
      customHeaders: new HttpHeaders().set(
        'Accept',
        'application/json, text/plain, */*'
      ),
    });
  }

  confirmTerminalRequest(
    request: POSNewRequestConfirmReq
  ): Observable<POSNewRequestConfirmRes> {
    return this.post(POS_SVC_URL_CONST.CONF_TERMINAL_REQ, request);
  }

  getToken(app: string): Observable<ExternalAppTokenRes> {
    return this.get(
      POS_SVC_URL_CONST.MANAGMENT_EXTERNAL_LINK + app + '/getToken'
    );
  }
}
