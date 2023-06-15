import { Injectable } from "@angular/core";
import { PosRequestConfirmReq } from "app/@core/model/rest/pos/request-management/confirm-req";
import { PosRequestValidateReq } from "app/@core/model/rest/pos/request-management/validate-req";
import { PosRequestValidateRes } from "app/@core/model/rest/pos/request-management/validate-res";
import { Observable } from "rxjs";
import { AbstractBaseService } from "../../base/abstract-base.service";
import { CONSTANTS } from "./pos-request-url";

@Injectable({
    providedIn: 'root',
})
export class PosRequestService extends AbstractBaseService {
    validateRequest(validateReq: PosRequestValidateReq): Observable<PosRequestValidateRes> {
        return this.post(CONSTANTS.POS_SERVICE_REQUEST_VALIDATE, validateReq);
    }
    confirmRequest(request: PosRequestConfirmReq): Observable<any> {
        return this.post(CONSTANTS.POS_SERVICE_REQUEST_CONFIRM, request);
    }
}