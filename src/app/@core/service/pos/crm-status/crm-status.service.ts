import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AbstractBaseService } from "../../base/abstract-base.service";
import { CONSTANTS } from "./crm-status-url";
import {CrmStatusReq} from "../../../model/rest/pos/crm-status/crm-status-req";
import {CrmStatusRes} from "../../../model/rest/pos/crm-status/crm-status-res";

@Injectable()
export class PosCRMStatusService extends AbstractBaseService {

  getCRMStatusList(statusReq: CrmStatusReq): Observable<CrmStatusRes> {
    return this.post(CONSTANTS.POS_CRM_STATUS_LIST, statusReq);
  }
}
