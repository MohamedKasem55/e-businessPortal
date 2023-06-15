export interface AccountStatementRes {
  accstmtDTO: {
    size: number,
    total: number,
    items: AccountStatementDTO []
  }
}

export interface AccountStatementDTO {
  date: string,
  hijraDate: string,
  time: string,
  amount: number,
  balance: number,
  description: string,
  txId: string,
  remarks: string,
  txCode: string,
  channelType: string,
  occMonthText: string,
  hijraMonthText: string,
  occDayText: string,
  hijraDayText: string,
  weekDay: string
  debit: any,
  credit: any,
  hour: string
  dateGroup: string
}
