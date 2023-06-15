export interface BfmBalanceAndCashFlowResponse {
  balance: Balance[];
  cashFlow: cashFlowResponse []
}

export interface cashFlowResponse {
  cashFlow: number,
  dateTime: string,
  totalIncome: number,
  totalExpense: number
}

export interface Balance {
  lasTransactionTime: string,
  balance: number
}
