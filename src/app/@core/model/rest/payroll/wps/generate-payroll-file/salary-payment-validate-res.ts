import {GenerateChallengeAndOTP} from "../../../common/otp.model";
import {WPSSalaryPaymentDetailsDSO} from "../../upload-file/wpssalary-payment-details-dso";

export interface SalaryPaymentValidateRes {
  warnings: string[];
  errors: string[];
  salaryPaymentDetails: WPSSalaryPaymentDetailsDSO;
  generateChallengeAndOTP?: GenerateChallengeAndOTP
}
