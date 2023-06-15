export interface StatementDtlsReq {
  accountNumber: string,
  statement: StatementDtls
}

export interface StatementDtls {
  amount: number
  balance: number
  channelType: string
  credit: number
  date: string
  dateGroup: string
  debit: string
  description: string
  hijraDate: string
  hijraDayText: string
  hijraMonthText: string
  hour: string
  occDayText: string
  occMonthText: string
  remarks: string
  time: string
  txCode: string
  txId: string
  weekDay: string
}
