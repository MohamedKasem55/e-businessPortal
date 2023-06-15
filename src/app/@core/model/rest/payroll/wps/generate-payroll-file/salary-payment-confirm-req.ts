import {RequestValidate} from "../../../common/otp.model";
import {WPSCompanyEmployeeDSO} from "../../upload-file/wpscompany-employee-dso";
import {WPSSalaryPaymentDetailsDSO} from "../../upload-file/wpssalary-payment-details-dso";

export interface SalaryPaymentConfirmReq {
  salaryPaymentDetails: WPSSalaryPaymentDetailsDSO;
  selectedEmployeeList: WPSCompanyEmployeeDSO[];
  requestValidate?: RequestValidate
}
