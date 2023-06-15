import { GenerateChallengeAndOTP } from "../../common/otp.model";

export interface CardSerialNumberDTO {
    serialNumber: string;
    addressSerial: string;
    serialNumberDate: any;
    closingBalance: any;
}

export interface SibaccountNumber {
      erNumber: any;
      modified: any;
      accountPk: any;
      alias: any;
      companyPk: any;
      branchid: string;
      branchName: any;
      typeAccount: string;
      code000: string;
      currency: string;
      checkDigit: string;
      numberAccount: string;
      availableBalance: any;
      ledgerBalance: any;
      status: string;
      exchangeRate: any;
      availableSarBalance: string;
      ibanNumber: string;
      txAccountString: any;
      unclearedBalance: any;
      ccdmAlias: string;
      accountLevels: any;
      inquiry: boolean;
      dashboard: boolean;
      payment: boolean;
      typeFunction: any;
      logoType: any;
      accountLogoUrl: any;
      fullAccountNumber: string;
      account18Length: string;
}
export interface OwnerCardsListModel {
    cardAccount: string;
    cardSerialNumberDTO: CardSerialNumberDTO;
    cardNumber: string;
    cardType: string;
    status: string;
    rewardPoints: string;
    nickname: string;
    sibaccountNumber: SibaccountNumber;
    indicator: string;
    cardNumberDisplay: string;
}

export interface CardsListResponseModel {
    cardsList: OwnerCardsListModel[];
    errorCode: string;
    errorDescription: string;
    errorResponse: any;
    generateChallengeAndOTP: GenerateChallengeAndOTP;
}