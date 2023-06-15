import { GenerateChallengeAndOTP } from "../../common/otp.model";

export interface BusinessCardsListModel {
    cardSeqNumber: string;
    cardNumber: string;
    cardNickName: string;
    embossingName: string;
    firstName: string;
    lastName: string;
    cardExpDate: string;
    sibAccountNumber: string;
    cardAccount: string;
    addressSeqNumber: string;
    creditCardType: string;
    showStatusFlg: string;
    payPalFlg: boolean;
    rewardPoints: number;
    cardIndicator: string;
    cardFullStatus: string;
    favouriteFlg: boolean;
    cardIcon: any;
    availableCash: string;
    availableCredit: string;
    consumedLimit: string;
    dueAmount: string;
    minDueAmount: any;
    dueDate: string;
    sortCode: any;
    cardStatus: string;
    crLimit: string;
    cashLimit: any;
    stmtAmt: string;
    unbilledAmt: string;
    totalAmt: string;
    prodCode: string;
    prodDesc: string;
    applePayStatus: string;
    lastDeactiveDate: any;
    cardCurrency: any;
    estatementFlg: boolean;
}
/**
 * developed in blind mode ( a copy of prepaid cards )not sure from service response 
 */
export interface BusinessCardsListResponseModel {
    businessCardsList: BusinessCardsListModel[];
    errorCode: string;
    errorDescription: string;
    errorResponse: any;
    generateChallengeAndOTP: GenerateChallengeAndOTP;
}