
export interface OwnerCardCurrentCycleAmountRes {
  creditCardAdvancedPayment: OwnerCardAdvancedPayment;
}

export interface OwnerCardAdvancedPayment {
  lastCycleAmount: number;
  currentCycleAmount: number;
  referenceNumber: string;
  accountBalance: number;
  totalAmount: number;
}
