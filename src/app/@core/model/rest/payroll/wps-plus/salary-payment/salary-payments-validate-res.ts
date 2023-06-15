import {WPSSalaryPaymentDetailsDSO} from "../../upload-file/wpssalary-payment-details-dso";
import {WPSSalaryFileDSO} from "../../wps/mol-file/mol-files-list-res";
import {GenerateChallengeAndOTP} from "../../../common/otp.model";

export interface SalaryPaymentsValidateRes {
  salaryPaymentDetails: WPSSalaryPaymentDetailsDSO;
  errors: string[];
  warnings: string[];
  files: WPSSalaryFileDSO[];
  generateChallengeAndOTP: GenerateChallengeAndOTP
}
