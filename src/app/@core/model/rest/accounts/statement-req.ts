export interface StatementReq {
  accountNumber: string;
  accountStmt:
    {
      amount: number,
      balance: number,
      channelType: string,
      date: string,
      description: string,
      hijraDate: string,
      hijraDayText: string,
      hijraMonthText: string,
      occDayText: string,
      occMonthText: string,
      remarks: string,
      time: string,
      dateGroup: string,
      txCode: string,
      txId: string,
      weekDay: string,
      debit: string,
      credit: number,
      hour: string,
    }
}


// "hour": "13:02"
// "credit": 1000,
// "debit": "",
// "dateGroup": "20221028",
