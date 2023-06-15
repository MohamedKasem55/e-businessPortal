import {WPSSalaryPaymentDetailsDSO} from "../../upload-file/wpssalary-payment-details-dso";
import {RequestValidate} from "../../../common/otp.model";

export interface SalaryPaymentsConfirmReq {
  salaryPaymentDetails:WPSSalaryPaymentDetailsDSO
  selectedEmployeeList:any[]
  requestValidate?: RequestValidate
}
