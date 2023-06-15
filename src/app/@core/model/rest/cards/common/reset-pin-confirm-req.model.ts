import { RequestValidate } from "../../common/otp.model";

export interface  CardsResetPinConfirmReqModel {
    cardNumber: string;
    cardSeqNumber: string;
    oldPinNumber: string;
    newPinNumber: string;
    typeOperation: string;
    requestValidate: RequestValidate;
}