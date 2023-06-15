import { GenerateChallengeAndOTP } from "../common/otp.model";

export interface SellGoldValidateRes {
    generateChallengeAndOTP?: GenerateChallengeAndOTP
    referenceNumber: string;
    transactionKey: string;
    rate: string;
    timeToLive: string;
    totalCost: number;
    measureUnit: string;
    weight: number;
    qty: number;
}
