import {GenerateChallengeAndOTP} from '../../common/otp.model';
import {Batch} from "../../common/batchResponse";

export interface PrepaidLoadFundsValidateResModel {
  errorCode: string;
  errorDescription: string;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  batchListsContainer: PrepaidCardsBatchList;
}

export interface PrepaidCardsBatchList {
    toProcess: PrepaidCardsBatch[];
    toAuthorize?: any[];
    notAllowed: any[];
}

export interface PrepaidCardsBatch extends Batch{
  typeOperation: string;
  holderName: any;
  cardNumber: string;
  cardSeqNumber: string;
  cardAccountSeqNumber: string;
  cardAccountNumber: string;
  feesAmount: string;
  equivalentAmount: number;
  expiryDate: any;
  reason: any;
  returnCode: any;
}

