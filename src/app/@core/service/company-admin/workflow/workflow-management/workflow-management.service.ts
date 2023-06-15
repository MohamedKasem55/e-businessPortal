import {Injectable} from '@angular/core';
import {Constants} from "./workflow-management-service-urls";
import {AbstractBaseService} from "../../../base/abstract-base.service";
import {Observable} from "rxjs";
import {AccountsReq} from "../../../../model/rest/accounts/accounts-req";
import {AccountsRes} from "../../../../model/rest/accounts/accounts-res";
import {
  GetAccountsPrivilegesRes
} from "../../../../model/rest/company-admin/workflow/workflow-management/get-accounts-privileges-res";
import {
  GetAccountLevelRes
} from "../../../../model/rest/company-admin/workflow/workflow-management/get-account-levels-res";
import {
  ValidateAccountWorkflowReq
} from "../../../../model/rest/company-admin/workflow/workflow-management/validate-account-workflow-req";
import {
  ValidateAccountWorkflowRes
} from "../../../../model/rest/company-admin/workflow/workflow-management/validate-account-workflow-res";
import {
  ConfirmAccountWorkflowReq
} from "../../../../model/rest/company-admin/workflow/workflow-management/confirm-account-workflow-req";
import {
  GetNonFinancialLevelsRes
} from "../../../../model/rest/company-admin/workflow/workflow-management/get-non-financial-levels-res";
import {
  ValidateNonFinancialWorkflowReq
} from "../../../../model/rest/company-admin/workflow/workflow-management/validate-non-financial-workflow-req";
import {
  ValidateNonFinancialWorkflowRes
} from "../../../../model/rest/company-admin/workflow/workflow-management/validate-non-financial-workflow-res";
import {
  ConfirmNonFinancialWorkflowReq
} from "../../../../model/rest/company-admin/workflow/workflow-management/confirm-non-financial-workflow-req";
import {
  ValidateETradeWorkflowReq
} from "../../../../model/rest/company-admin/workflow/workflow-management/validate-e-trade-workflow-req";
import {
  ValidateETradeWorkflowRes
} from "../../../../model/rest/company-admin/workflow/workflow-management/validate-e-trade-workflow-res";
import {
  ConfirmETradeWorkflowReq
} from "../../../../model/rest/company-admin/workflow/workflow-management/confirm-e-trade-workflow-req";
import {BaseResponse, ErrorBaseResponse} from "../../../../model/rest/common/base-response";
import {EtradeCompanyDetails} from "../../../../model/rest/company-admin/user-details/register-user-init";
import {UserManagementConstants} from "../../user-management/users-management-urls";


@Injectable()
export class WorkflowManagementService extends AbstractBaseService {
  constructor() {
    super();

  }


  getCompanyDetails(): Observable<EtradeCompanyDetails> {
    return this.get(UserManagementConstants.E_TRADE_COMPANY_DETAILS, {hideLoader: true});
  }

  getAccounts(req: AccountsReq): Observable<AccountsRes> {
    return this.post(Constants.getAccountsList, req, {hideLoader: true})
  }

  getAccountLevels(req: AccountsReq): Observable<GetAccountLevelRes> {
    return this.post(Constants.getAccountLevels, req)
  }

  validateAccountWorkflow(req: ValidateAccountWorkflowReq): Observable<ValidateAccountWorkflowRes> {
    return this.post(Constants.validateAccountWorkflow, req)
  }

  confirmAccountWorkflow(req: ConfirmAccountWorkflowReq): Observable<ErrorBaseResponse> {
    return this.post(Constants.confirmAccountWorkflow, req)
  }

  getNonFinancialWorkflowLevels(): Observable<GetNonFinancialLevelsRes> {
    return this.get(Constants.getNonFinancialWorkflowLevels, {hideLoader: true})
  }

  validateNonFinancialWorkflow(req: ValidateNonFinancialWorkflowReq): Observable<ValidateNonFinancialWorkflowRes> {
    return this.post(Constants.validateNonFinancialWorkflow, req)
  }

  confirmNonFinancialWorkflow(req: ConfirmNonFinancialWorkflowReq): Observable<ErrorBaseResponse> {
    return this.post(Constants.confirmNonFinancialWorkflow, req)
  }

  validateETradeWorkflow(req: ValidateETradeWorkflowReq): Observable<ValidateETradeWorkflowRes> {
    return this.post(Constants.validateETradeWorkflow, req)
  }

  confirmETradeWorkflow(req: ConfirmETradeWorkflowReq): Observable<ErrorBaseResponse> {
    return this.post(Constants.confirmETradeWorkflow, req)
  }
}
