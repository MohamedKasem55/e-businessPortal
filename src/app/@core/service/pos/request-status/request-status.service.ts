import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RequestListClaimPosManagement} from 'app/@core/model/rest/point_of_sales/request-status-req/claims-status-req';
import {ResponseListClaimPosManagement} from 'app/@core/model/rest/point_of_sales/request-status-req/claims-status-res';
import {RequestListPosManagement} from 'app/@core/model/rest/point_of_sales/request-status-req/maintenance-status-req';
import {
  ResponseListMaintenancePosManagement
} from 'app/@core/model/rest/point_of_sales/request-status-req/maintenance-status-res';
import {
  ResponseClaimListRequestStatusPosManagement
} from 'app/@core/model/rest/point_of_sales/request-status-req/management-status-res';
import {
  RequestListNewRequestPosManagement
} from 'app/@core/model/rest/point_of_sales/request-status-req/new-request-status-req';
import {
  ResponseNewRewquestListRequestStatusPosManagement
} from 'app/@core/model/rest/point_of_sales/request-status-req/new-request-status-res';
import {Observable} from 'rxjs';
import {AbstractBaseService} from '../../base/abstract-base.service';
import {CLL_MNG_REQ_STATUS_URLS} from './request-status-service-url';

@Injectable()
export class RequestStatusService extends AbstractBaseService {

  getClaimsStatusList(request: RequestListClaimPosManagement): Observable<ResponseListClaimPosManagement> {
    return this.post(CLL_MNG_REQ_STATUS_URLS.CLAIM_LIST_STATUS, request, {hideLoader: true});
  }

  getPOSMaintenanceStatusList(request: RequestListPosManagement): Observable<ResponseListMaintenancePosManagement> {
    return this.post(CLL_MNG_REQ_STATUS_URLS.CLAIM_MAINTENANCE, request, {hideLoader: true});
  }

  getPOSManagementStatusList(request: RequestListPosManagement): Observable<ResponseClaimListRequestStatusPosManagement> {
    return this.post(CLL_MNG_REQ_STATUS_URLS.CLAIM_MANAGEMET, request, {hideLoader: true});
  }

  getNewRequestStatusList(request: RequestListNewRequestPosManagement): Observable<ResponseNewRewquestListRequestStatusPosManagement> {
    return this.post(CLL_MNG_REQ_STATUS_URLS.CLAIM_NEW_REQUEST, request, {hideLoader: true});
  }


}
