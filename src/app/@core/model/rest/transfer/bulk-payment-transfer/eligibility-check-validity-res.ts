export interface EligibilityCheckValidityRes {
  eligibleToRegister: boolean;
  reason: string;
  fees: ResBulkPaymentAgreementRegistrationInit;
}

export interface ResBulkPaymentAgreementRegistrationInit {
  monthlyFees: number;
  localTxFees: number;
  localTxFailureFees: number;
  localTxCancelFees: number;
  localTxCurrentValueDateFees: number;
  rajhiTxFees: number;
  rajhiTxFailureFees: number;
  rajhiTxCancelFees: number;
}
