import {Injectable} from '@angular/core';
import {Constants} from "./change-workflow-service-urls";
import {AbstractBaseService} from "../../../base/abstract-base.service";
import {Observable} from "rxjs";
import {ChangeWorkflowReq} from "../../../../model/rest/company-admin/workflow/change-workflow/change-workflow-req";
import {CompanyWorkflowEligibleRes} from "../../../../model/rest/company-admin/workflow/change-workflow/company-eligible-workflow-res";
import {ValidateChangeWorkflowReq} from "../../../../model/rest/company-admin/workflow/change-workflow/validate-change-workflow-req";
import {ValidateChangeWorkflowRes} from "../../../../model/rest/company-admin/workflow/change-workflow/validate-change-workflow-res";


@Injectable()
export class ChangeWorkflowService extends AbstractBaseService {
  constructor() {
    super();

  }

  getCompanyEligibleWorkflow(): Observable<CompanyWorkflowEligibleRes> {
    return this.get(Constants.eligibleWorkflow)
  }

  validateChangeCompanyWorkflow(req: ValidateChangeWorkflowReq): Observable<ValidateChangeWorkflowRes> {
    return this.post(Constants.validateChangeCompanyWorkflow, req)
  }

  confirmChangeCompanyWorkflow(req: ChangeWorkflowReq): Observable<any> {
    return this.post(Constants.confirmChangeCompanyWorkflow, req)
  }
}
