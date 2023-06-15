import {Injectable} from "@angular/core";
import {BaseResponse} from "app/@core/model/rest/common/base-response";
import {CompanyParametersRes} from "app/@core/model/rest/company-admin/company-configuration/company-parameters-res";
import {
  CompanyParametersReq,
  companyWorkFlowTypeModel
} from "app/@core/model/rest/company-admin/company-configuration/company-workflow-type-res";
import { IncrementTriesReq } from "app/@core/model/rest/company-admin/company-configuration/increment-tries-req";
import {Observable} from "rxjs";
import {AbstractBaseService} from "../../base/abstract-base.service";
import {CompanyConfigurationConstants} from "./company-configuration-urls";

@Injectable()
export class CompanyConfigurationService extends AbstractBaseService {

  getCompanyParameters(): Observable<CompanyParametersRes> {
    return this.get(CompanyConfigurationConstants.COMPANY_MANAGEMENT_PARAMETERS);
  }

  updateCompanyParameters(req: CompanyParametersReq): Observable<BaseResponse> {
    return this.post(CompanyConfigurationConstants.UPDATE_COMPANY_MANAGEMENT_PARAMETERS, req);
  }

  public incrementTries(req: IncrementTriesReq): Observable<any> {
    return this.put(CompanyConfigurationConstants.UPDATE_INCREMENT_TRIES, req);
  }

}

