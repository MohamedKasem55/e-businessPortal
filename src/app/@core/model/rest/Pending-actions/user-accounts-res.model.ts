import { Account } from "../common/account";
import { BaseResponse } from "../common/base-response";

export interface UserAccountsResModel extends BaseResponse {
  accountList: Account;
}