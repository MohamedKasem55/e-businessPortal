import {LineValidationDTO} from "./line-validation-dto";
import {WPSCompanyEmployeeDSO} from "./wpscompany-employee-dso";
import {Employee} from "../wps-plus/request-open-account/validate-open-account-req";
import {BatchWPSPlusListsContainerDTO} from "../wps-plus/request-open-account/confirm-open-account-req";
import {GenerateChallengeAndOTP} from "../../common/otp.model";

export interface UploadEmployeeFileValidateRes {
  lineValidationList: LineValidationDTO[];
  fileName: string;
  linesWithError: number;
  companyEmployeeList: WPSCompanyEmployeeDSO[];
}


export interface WPSPlusEmployeeFileRes {
  batchContainer: BatchWPSPlusListsContainerDTO
  invalidEmployees: Employee[]
  totalAmountProcess: number
  totalAmountAuth: number
  totalNotAllowed: number
  generateChallengeAndOTP:GenerateChallengeAndOTP

}
