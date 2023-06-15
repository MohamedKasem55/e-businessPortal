import {Injectable} from "@angular/core";
import { ConfirmTokenOrderReq } from "app/@core/model/rest/company-admin/token-management/confirm-token-order-req";
import { TokenAssignmentStatusRes } from "app/@core/model/rest/company-admin/token-management/token-assignment-status-res";
import { TokenManagementSummaryRes } from "app/@core/model/rest/company-admin/token-management/token-management-summary-res";
import { ValidateTokenOrderReq } from "app/@core/model/rest/company-admin/token-management/validate-token-order-req";
import { ValidateTokenOrderRes } from "app/@core/model/rest/company-admin/token-management/validate-token-order-res";
import { PaginationListReq } from "app/@core/model/rest/payments/pagination-list-req";
import {Observable} from "rxjs";
import {AbstractBaseService} from "../../base/abstract-base.service";
import {TokenManagementConstants} from "./token-managment-urls";

@Injectable()
export class TokenManagmentService extends AbstractBaseService {
  
  getTokenManagementSummary(req:PaginationListReq): Observable<TokenManagementSummaryRes> {
    return this.post(TokenManagementConstants.TOKEN_MANAGEMENT_SUMMARY, req, {hideLoader: true});
  }

  orderTokenValidation(req:ValidateTokenOrderReq): Observable<ValidateTokenOrderRes> {
    return this.post(TokenManagementConstants.TOKEN_MANAGEMENT_ORDER_VALIDATE, req);
  }

  orderTokenConfirmation(req:ConfirmTokenOrderReq): Observable<any> {
    return this.post(TokenManagementConstants.TOKEN_MANAGEMENT_ORDER_CONFIRM, req);
  }

  getTokenAssignmentStatus(tokenSerialNumber: string): Observable<TokenAssignmentStatusRes> {
    return this.get(TokenManagementConstants.TOKEN_MANAGEMENT_TOKEN+tokenSerialNumber);
  }

  updateTokenAssignmentStatus(tokenSerialNumber: string, status: string): Observable<any> {
    return this.put(TokenManagementConstants.TOKEN_MANAGEMENT_TOKEN+tokenSerialNumber+"/"+status, {});
  }

}
