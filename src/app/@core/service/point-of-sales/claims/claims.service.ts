import { Injectable } from "@angular/core";
import { AbstractBaseService } from "../../base/abstract-base.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { RequestDetailsClaimPosManagement } from "app/@core/model/rest/point_of_sales/claims/request-details-claim";
import { TransactionListsReqModel } from "app/@core/model/rest/point_of_sales/claims/transaction-list-re.model";
import { Constants } from "./claims-service-url";
import { RequestConfirmClaimPosManagement } from "app/@core/model/rest/point_of_sales/claims/request-confirm-claim";
import { ResponseDetailsClaimPosManagement } from "app/@core/model/rest/point_of_sales/claims/response-details-claim";
import { TransactionListResModel } from "app/@core/model/rest/point_of_sales/claims/transaction-list-res.model";
import { ResponseValidateClaimPosManagement } from "app/@core/model/rest/point_of_sales/claims/response-validate-claim.model";
import { ResponseConfirmClaims } from "app/@core/model/rest/point_of_sales/claims/response-confirm-claim";
import { RequestListClaimPosManagement } from "app/@core/model/rest/point_of_sales/claims/request-list-claim";
 

@Injectable()
export class  ClaimsService extends AbstractBaseService {


getClaims(data: RequestListClaimPosManagement): Observable<ResponseDetailsClaimPosManagement> {
    return this.post(Constants.CLAIMS_LIST, data);
}

confirmClaims(data: RequestConfirmClaimPosManagement): Observable<ResponseConfirmClaims> {
    return this.post(Constants.CLAIMS_CONFIRM, data);
}

getDetails(data: RequestDetailsClaimPosManagement): Observable<ResponseDetailsClaimPosManagement> {
    return this.post(Constants.CLAIMS_DETAILS, data);
}

getTransactionList(data: TransactionListsReqModel) : Observable<TransactionListResModel> {
    return this.post(Constants.CLAIMS_TRANSACTION_LIST, data);
}

public validateClaims(data: FormData): Observable<ResponseValidateClaimPosManagement> {
    return this.post(Constants.CLAIMS_VALIDATE, data , {customHeaders: new HttpHeaders()
    .set('Accept', 'application/json, text/plain, */*')
    .set('Content-Type', 'multipart/form-data'),})
  }

searchTerminals() {
    return this.get(Constants.CLAIMS_SEARCH_TERMINALS);
}
}
