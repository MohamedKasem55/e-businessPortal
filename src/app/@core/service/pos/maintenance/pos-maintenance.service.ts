import { Injectable } from "@angular/core";
import { PosMaitananceConfirmReq } from "app/@core/model/rest/pos/maintenance/confirm-req";
import { PosMaintananceValidateReq } from "app/@core/model/rest/pos/maintenance/validate-req";
import { PosMaintananceValidateRes } from "app/@core/model/rest/pos/maintenance/validate-res";
import { Observable } from "rxjs";
import { AbstractBaseService } from "../../base/abstract-base.service";
import { CONSTANTS } from "./pos-maintenance-url";

@Injectable({
    providedIn: 'root',
})
export class PosMaintenanceService extends AbstractBaseService {
    validateMaintenanceRequest(validateReq: PosMaintananceValidateReq): Observable<PosMaintananceValidateRes> {
        return this.post(CONSTANTS.POS_SERVICE_MAINTENANCE_VALIDATE, validateReq);
    }
    confirmMaintenceRequest(request: PosMaitananceConfirmReq): Observable<any> {
        return this.post(CONSTANTS.POS_SERVICE_MAINTENANCE_CONFIRM, request);
    }
}