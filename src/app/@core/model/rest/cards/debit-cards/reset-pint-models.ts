import { GenerateChallengeAndOTP, RequestValidate } from "../../common/otp.model";


export interface DebitResetPinValidateRes {
    generateChallengeAndOTP: GenerateChallengeAndOTP
}

export interface DebitResetPinCofnrimRequest {
    cardNum: string;
    cardSeqNum: string;
    prodType: string;
    acctNum: string;
    pin: string;
    newPIN: string;
    requestValidate: RequestValidate
}