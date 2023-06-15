import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { POSNewRequestConfirmReq, POSNewRequestConfirmRes, POSNewRequestValidateRes } from 'app/@core/model/rest/pos/new-req/new-request-res';
import { POSTerminalsRequestRes } from 'app/@core/model/rest/pos/new-req/terminals-request-res';
import { POSAnalyticsRequest } from 'app/@core/model/rest/pos/pos-analytics-req/analytics-req';
import { POSAnalyticsResponse } from 'app/@core/model/rest/pos/pos-analytics-req/analytics-res';
import { POSInactiveTerminalsResponse } from 'app/@core/model/rest/pos/pos-analytics-req/inactive-terminals-res';
import { POSTerminalsStatisticsResponse } from 'app/@core/model/rest/pos/pos-analytics-req/terminals-statistics-res';
import { POSFinancialTransListResponse } from 'app/@core/model/rest/pos/pos-analytics-req/transis-list.res';
import { Observable } from 'rxjs';
import { AbstractBaseService } from '../../base/abstract-base.service';
import { POS_ANALYTICS_URLS } from './pos-analytics-service-url';

@Injectable({
  providedIn: 'root'
})
export class posAnalyticsService  extends AbstractBaseService {

  getInactiveTerminals(request: POSAnalyticsRequest):Observable<POSInactiveTerminalsResponse> {
    return this.post(POS_ANALYTICS_URLS.INACTIVE_TERMINALS, request);
  }

  getTerminalStatistics(request: POSAnalyticsRequest):Observable<POSTerminalsStatisticsResponse> {
    return this.post(POS_ANALYTICS_URLS.TERMINAL_STATISTICS, request);
  }

  getFinancialTransistList(request: POSAnalyticsRequest):Observable<POSFinancialTransListResponse> {
    return this.post(POS_ANALYTICS_URLS.TRANSIST_LIST, request);
  }

}
