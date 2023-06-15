export interface BillPaymentValidateReq {
  accountNumber?: string
  billSelected?: BillSelected[]
  emailChecked?: string
}

export interface BillSelected {
  amountPaid?: number
  billCodeSelected?: string
  billReference?: string
  dueDate?: Date
  nickName?: string
}
