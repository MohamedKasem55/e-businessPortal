import {
  GenerateChallengeAndOTP,
  RequestValidate,
} from '../../common/otp.model';
import { BatchListsContainer } from '../../payments/billPayment/bill-payment-validate-res';
import { AccountsItem } from '../business-cards/business-cards-models';

export interface BusinessCardSelected {
  accountItem: AccountsItem;
  accountNumber: string;
  paymentOption: number;
  amount: number;
}

export interface BusinessCardPaymentValidateDetailAndListRequest {
  businessCardSelected: BusinessCardSelected[];
  cardId: string;
}

export interface BusinessCardPaymentValidateRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  batchListsContainer: BatchListsContainer;
}

export interface FutureSecurityLevelsDTOList {
  batchSecurityPk?: any;
  level: number;
  status: string;
  updater: string;
  updateDate?: any;
  userPk?: any;
  auditStatus?: any;
  pdfStatus?: any;
}

export interface CardPaymentConfirmRequestModel {
  requestValidate?: RequestValidate;
  batchListsContainer: BatchListsContainer;
}

export interface BusinessCardPaymentConfirmRes {}
