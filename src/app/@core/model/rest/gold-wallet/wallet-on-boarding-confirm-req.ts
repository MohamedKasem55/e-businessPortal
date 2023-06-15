import { Account } from "../common/account";
import { RequestValidate } from "../common/otp.model";

export interface WalletOnBoardingConfirmReq {
    linkedAccountDTO: Account;
    requestValidate?: RequestValidate;
}
