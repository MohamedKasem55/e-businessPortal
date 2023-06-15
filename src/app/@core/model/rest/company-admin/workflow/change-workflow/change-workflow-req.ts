import {CompanyWorkflowTypeEnum} from "../company-workflow-type-enum";
import {RequestValidate} from "../../../common/otp.model";

export interface ChangeWorkflowReq{
  companyWorkflowType: CompanyWorkflowTypeEnum;
  requestValidateSecondFactor?: RequestValidate;
  companyWorkFlowUserConfigurations?: CompanyWorkFlowUserConfiguration[]
}

export interface CompanyWorkFlowUserConfiguration{
  userId?: string
  maker?: boolean
  checker?: boolean
}
