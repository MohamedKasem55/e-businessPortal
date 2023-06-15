import {WPSSalaryPaymentDetailsDSO} from "../../upload-file/wpssalary-payment-details-dso";

export interface SalaryPaymentsValidateReq {
  employees: any[];
  accountNumber: string;
  salaryPaymentDetails: WPSSalaryPaymentDetailsDSO;
}
