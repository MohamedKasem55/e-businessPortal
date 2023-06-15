export interface BulkBillReq {
  accountNumber: string,
  emailChecked: "0",
  billSelected: Bill[]
}

export interface Bill {
  billCodeSelected: string,
  billReference: string,
  amountPaid: number,
  nickName: string,
  dueDate: string
}
