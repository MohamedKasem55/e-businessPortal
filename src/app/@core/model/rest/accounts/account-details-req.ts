export interface AccountDetailsReq {
  accountNumber: string;
  statment: AccountStatementComponent;
}

export interface AccountStatementComponent {
  date: string;
  hijraDate: string;
  time: string;
  amount: number;
  balance: number;
  description: string;
  txId: string;
  remarks: string;
  txCode: string;
  channelType: string;
  occMonthText: string;
  hijraMonthText: string;
  occDayText: string;
  hijraDayText: string;
  weekDay: string;
  txLabelType: string;
  txLabelValue: string;
}
