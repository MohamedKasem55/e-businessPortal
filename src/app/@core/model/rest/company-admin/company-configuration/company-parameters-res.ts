import { BaseResponse } from "../../common/base-response"

export interface CompanyParametersRes extends BaseResponse {
  companyWorkflowType: string ;
  resetPassPushNotification: boolean;
  vatNumber: number;
  preventUserDualBatchApproval:boolean
}
