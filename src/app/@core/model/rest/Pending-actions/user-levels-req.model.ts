import { BaseResponse } from "../common/base-response";

export interface UserAccountsReqModel extends BaseResponse {
  paymentTypes: string[];
  accountNumber?: String;
}