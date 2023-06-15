import { ResponseGenerateChallenge } from "../common/base-response";
import { RequestValidate } from "../common/otp.model";
import { BuyGoldValidateRes } from "./buy-gold-validate-res";
import { GoldWalletBullionRes } from "./gold-wallet-bullion-res";

export interface GoldWalletBuyRequestDTO {
    termsAndConditionAccepted: boolean;
    requestedBullion: RequestedBullion ;
    buyGoldValidateRes: BuyGoldValidateRes ;
    requestValidate: RequestValidate ;
    goldWalletBullionRes: GoldWalletBullionRes ;
    generateChallengeAndOTP: ResponseGenerateChallenge;
}

export interface RequestedBullion {
    selectedBullion: number;
    custom: boolean;
}
