import {CompanyWorkflowTypeEnum} from "../company-workflow-type-enum";

export interface CompanyWorkflowEligibleRes {
  "eligibleWorkflows": CompanyWorkflowEligible[],
  currentCompanyWF: CompanyWorkflowTypeEnum,
}

export interface CompanyWorkflowEligible {
  companyWorkflowType: CompanyWorkflowTypeEnum;
  selected: boolean;
  recommended: boolean;
  current: boolean;
}
