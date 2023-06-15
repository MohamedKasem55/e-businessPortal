import {RequestValidate} from "../../common/otp.model";
import {WPSSalaryPaymentDetailsDSO} from "./wpssalary-payment-details-dso";
import {WPSPayrollBatchDSO} from "./wpspayroll-batch-dso";

export interface UploadFileConfirmReq {
  payrollBatch: WPSPayrollBatchDSO;
  salaryPaymentDetails: WPSSalaryPaymentDetailsDSO;
  requestValidate?: RequestValidate;
}
