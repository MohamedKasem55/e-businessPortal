import { Account } from "../common/account";
import { BaseResponse } from "../common/base-response";

export interface UserAccountsResModel extends BaseResponse {
  workflowTypePaymentList: workflowTypePayment[];
  paymentTypes: string[];
}

export interface workflowTypePayment {
  paymentId: string;
  details: Details[];
}

export interface Details {
  amountMin: string;
  amountMax: string;
  levels: boolean[];
}