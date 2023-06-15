import { RequestValidate } from "../common/otp.model";

export interface SellGoldConfirmReq {
    requestValidate?: RequestValidate;
    referenceNumber: string;
    transactionKey: string;
}
