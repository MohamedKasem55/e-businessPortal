import {
  GenerateChallengeAndOTP,
  RequestValidate,
} from '../../common/otp.model';
import { BatchListsContainer } from '../../payments/billPayment/bill-payment-validate-res';
import { BusinessCardsDetailsModel } from '../business-cards/business-cards-models';

export interface CardClosureValidateRes {
  operation: string;
  deactivationReason: string;
  cardNumber: string;
  cardSeqNumber: string;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
}

export interface CardClosureConfirmRes {}

export interface CardClosureValidateRequest {
  cardNumber: string;
  cardSeqNumber: string;
  operation: string;
}

export interface CardClosureConfirmRequest {
  cardNumber: string;
  cardSeqNumber: string;
  operation: string;
  requestValidate: RequestValidate;
}

export interface AccountsItemList {
  currency: string;
  limit: number;
  availableBalance: number;
  availableCash: number;
  cardAccountNumber: string;
  cardAccountSeqNumber: string;
  authStatus: string;
}

export interface CardBlockValidateReueust {
  businessCardsDetails: BusinessCardsDetailsModel | undefined;
  blockReason: string | undefined;
  typeOperation: string | undefined;
}

export interface CardBlockValidateRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  businessCardsDetails: BusinessCardsDetailsModel;
}

export interface AccountsItemList {
  currency: string;
  limit: number;
  availableBalance: number;
  availableCash: number;
  cardAccountNumber: string;
  cardAccountSeqNumber: string;
  authStatus: string;
}

export interface BlockCardConfirmRequest {
  businessCardsDetails: BusinessCardsDetailsModel | undefined;
  requestValidate: RequestValidate | undefined;
  typeOperation: string | undefined;
}

export interface BlockCardConfirmRes {}

export interface SuspendDebitCardRequest {
  cardNum: string;
  cardSeqNum: string;
  prodType: string;
  acctNum: string;
  suspendReason: string;
}

export interface SuspendDebitCardRes {}




export interface PrepaidValidateStolenRequest {
  cardNumber: string;
  cardSeqNumber: string;
  deactivationReason: string;
  operation?: string; //'CL', 'SC', 'SL'
}

export interface PrepaidValidateStolenRes {
  cardNumber: string
  cardSeqNumber: string
  deactivationReason: string
  operation: string
  generateChallengeAndOTP: GenerateChallengeAndOTP
}

export interface PrepaidConfirmStolenRequest {
  cardNumber: string
  cardSeqNumber: string
  deactivationReason: string
  requestValidate: RequestValidate
  operation?: string; //'CL', 'SC', 'SL'
}

export interface PrepaidConfirmStolenRes {
  
}

export interface PrepaidValidateClosureRequest {
  cardNumber: string;
  cardSeqNumber: string;
  operation?: string; //'CL'
}

export interface PrepaidValidateClosureRes {
  accountDigits: string
  cardId: string
  generateChallengeAndOTP: GenerateChallengeAndOTP
}

export interface PrepaidConfirmClosureRequest {
  cardNumber: string;
  cardSeqNumber: string;
  operation?: string; //'CL'
  requestValidate: RequestValidate
}

export interface PrepaidConfirmClosureRes {
  
}

export interface PrepaidValidateReplaceRequest {
  cardNumber: string
  cardSeqNumber: string
  typeOperation?: string // 'SC'
}

export interface PrepaidValidateReplaceRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP
  batchListsContainer: BatchListsContainer
}


export interface PrepaidConfirmReplaceRequest {
  cardNumber: string
  cardSeqNumber: string
  requestValidate?: RequestValidate
  typeOperation?: string // 'SC'
}

export interface PrepaidConfirmReplaceRes {
}

