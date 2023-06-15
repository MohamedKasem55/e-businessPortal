import { Injectable } from '@angular/core';
import {SwitchCompanyReq} from "../../model/rest/holding-company/switch-company-req";
import {AbstractBaseService} from "../base/abstract-base.service";
import {HoldingCompanyConstants} from "./holding-company-urls";

@Injectable({
  providedIn: 'root'
})
export class HoldingCompanyService extends AbstractBaseService{

  constructor() {
    super();
  }

  switchCompanyHoldingOrSubsidiary(changeCurrentCompany: SwitchCompanyReq){
    return this.post(HoldingCompanyConstants.HOLDING_SUBSIDIARY_SWITCH, changeCurrentCompany)
  }
}
