import { Account } from '../../common/account';
import {
  GenerateChallengeAndOTP,
  RequestValidate,
} from '../../common/otp.model';

export interface RecordsPaginationCtrlModel {
  sentRecs: number;
  matchedRecs: number;
  complFlg: string;
}

export interface DebitCardsListModel {
  cardNum: string;
  cardSeqNum: string;
  cardStatus: string;
  internetFlg: string;
  secureFlg: string;
  nickname: string;
  favoriteFlg: string;
  acctNum: string;
  whiteLstFlg: any;
  prodType: string;
  prodDesc: string;
  applePayStatus: string;
}

export interface DebitCardsListResponseModel {
  cardDtlsLst: DebitCardsListModel[];
  errorCode: string;
  errorDescription: string;
  errorResponse: any;
  generateChallengeAndOTP: GenerateChallengeAndOTP;
  recPgCtrl: RecordsPaginationCtrlModel;
}

export interface DebitCardPOSLimitsRequest {
  cardNumber: string;
  cardSeqNumber: string;
}

export interface DebitCardsPOSLimitListRequest {
  cardNumber: string;
}

export interface DebitCardsPOSLimitListRes {
  debitCard: DebitCard;
}

export interface DebitCard {
  maxValue?: any;
  minValue?: any;
  limits: Limit[];
}

export interface Limit {
  amount: string;
  currency: string;
}

export interface DebitCardPOSLimitsRes {
  atmDomesticLimit: AtmDomesticLimit;
  atmInternationalLimit: AtmInternationalLimit;
  atmsamaLimit: AtmsamaLimit;
  posDomesticLimit: PosDomesticLimit;
  pOsInternationalLimit: POsInternationalLimit;
  possamaLimit: PossamaLimit;
  posRefundLimit: PosRefundLimit;
  depositLimit: DepositLimit;
  transferLimit: TransferLimit;
}

export interface AtmDomesticLimit {
  amount: string;
  currency: string;
}

export interface AtmInternationalLimit {
  amount: string;
  currency: string;
}

export interface AtmsamaLimit {
  amount: string;
  currency: string;
}

export interface PosDomesticLimit {
  amount: string;
  currency: string;
}

export interface POsInternationalLimit {
  amount: string;
  currency: string;
}

export interface PossamaLimit {
  amount: string;
  currency: string;
}

export interface PosRefundLimit {
  amount: string;
  currency: string;
}

export interface DepositLimit {
  amount: string;
  currency: string;
}

export interface TransferLimit {
  amount: string;
  currency: string;
}

export interface DebitCardChangeInternetRequest {
  cardNum: string;
  cardSeqNum: string;
  prodType: string;
  enableECommerce: boolean;
}

export interface DebitCardChangeInternetRes {}

export interface DebitCardChangePOSLimitRequest {
  cardNumber: string;
  cardSeqNumber: string;
  atmDomesticLimit: AtmDomesticLimit | undefined;
  atmInternationalLimit: AtmInternationalLimit | undefined;
  atmsamaLimit: AtmsamaLimit | undefined;
  posDomesticLimit: PosDomesticLimit | undefined;
  possamaLimit: PossamaLimit | undefined;
  posRefundLimit: PosRefundLimit | undefined;
  depositLimit: DepositLimit | undefined;
  transferLimit: TransferLimit | undefined;
  posInternationalLimit: POsInternationalLimit | undefined;
}

export interface DebitCardChangePOSLimitRes {}

export interface DebitCardApplyNewCardInitRes {
  embossingNames: string[];
  accounts: Account[];
  gender: string;
}

export interface DebitCardValidateApplyNewCardRes {
  generateChallengeAndOTP: GenerateChallengeAndOTP;
}

export interface DebitCardConfirmApplyNewCardRequest {
  accountNumber: string;
  branchId: string;
  gender: string;
  embossingName: string;
  requestValidate: RequestValidate;
}

export interface DebitCardConfirmApplyNewCardRes {}

export interface BranchesOfCityReqeust {
  name?: string;
  key: string;
}
