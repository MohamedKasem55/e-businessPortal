import {Account} from "../../../common/account";
import {WPSSalaryPaymentDetailsDSO} from "../../upload-file/wpssalary-payment-details-dso";

export interface SalaryPaymentsInitRes {
  salaryPaymentDetails: WPSSalaryPaymentDetailsDSO;
  accountList: Account[]
  juridicalState: string
}
