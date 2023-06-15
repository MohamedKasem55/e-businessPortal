import { GenerateChallengeAndOTP } from "../common/otp.model";
import {BullionWeight} from "./gold-wallet-bullion-res";

export interface BuyGoldValidateRes {
    generateChallengeAndOTP?: GenerateChallengeAndOTP
    referenceNumber: string;
    transactionKey: string;
    rate: string;
    goldVendor: string;
    timeToLive: string;
    totalCost: number;
    measureUnit: string;
    weight: number;
    qty: number;
    purity: number;
    goldSource: string;
}
