import { GenerateChallengeAndOTP } from "../../common/otp.model";

export interface CardInfoModel {
    cardAccount: any;
    cardSerialNumberDTO: any;
    cardNumber: string;
    cardType: any;
    status: any;
    rewardPoints: any;
    nickname: any;
    sibaccountNumber: any;
    indicator: any;
    cardNumberDisplay: any;
}
export interface CardBalanceModel {
    card: CardInfoModel;
    creditLimit: number;
    lastMonthsStatementAmount: number;
    availableBalance: number;
    availableCash: number;
    account: any;
    ccStmt: any;
}
export interface OwnerCardDetailsModel {
    serialList: any;
    date: string;
    hijraDate: string;
    balance: CardBalanceModel;
    amountPayableOnDueDate: number;
    paymentDueDate: string;
    unbilledAmount: number;
    withdrowLimit: any;
    totalAmount: number;
    vbvField: string;
    cardStatus: string;
}
export interface OwnerCardDetailsResponseModel {
    resultCardSerialList: OwnerCardDetailsModel;
    errorCode: string;
    errorDescription: string;
    errorResponse: any;
    generateChallengeAndOTP: GenerateChallengeAndOTP;
}

