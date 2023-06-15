import {GenerateChallengeAndOTP} from "../../common/otp.model";
import {WPSSalaryPaymentDetailsDSO} from "./wpssalary-payment-details-dso";
import {WPSPayrollBatchDSO} from "./wpspayroll-batch-dso";
import {LineValidationDTO} from "./line-validation-dto";
import {WPSCompanyEmployeeDSO} from "./wpscompany-employee-dso";
interface WPSSalaryFileDSO {
  type: string;
  batchName: string;
}


export interface UploadSalaryFileValidateRes {
  lineValidationList: LineValidationDTO[]
  fileName: string
  linesWithError: number
  companyEmployeeList: WPSCompanyEmployeeDSO[]
  validBalance: number
  payrollBatch: WPSPayrollBatchDSO;
  files: WPSSalaryFileDSO[]
  salaryPaymentDetails: WPSSalaryPaymentDetailsDSO
  generateChallengeAndOTP: GenerateChallengeAndOTP;
}

