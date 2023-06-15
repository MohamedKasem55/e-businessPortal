import { RequestValidate } from "../common/otp.model";

export interface BuyGoldConfirmReq {
    referenceNumber: string;
    transactionKey: string;
    requestValidate?: RequestValidate;

}
