import {WPSSalaryPaymentDetailsDSO} from "../../upload-file/wpssalary-payment-details-dso";
import {WPSCompanyEmployeeDSO} from "../../upload-file/wpscompany-employee-dso";

export interface SalaryPaymentValidateReq {
  accountNumber: string;
  salaryPaymentDetails: WPSSalaryPaymentDetailsDSO;
  selectedEmployeesList: WPSCompanyEmployeeDSO[];
}
