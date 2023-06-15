import {BaseResponse} from "../common/base-response";

export interface ChequesListReq {
  accountNumber?: string,
  checkNumber?: string,
  dateFrom?: string,
  dateTo?: string,
  page?: number,
  rows?: number
}

export interface ChequesListRes extends BaseResponse {

  checkDetailsList: {
    size: number,
    total: number,
    items: Cheque[]
  }
}

export interface Cheque {
  checkNumber: string,
  accountNumber: string,
  beneficiaryName: string,
  checkAmount: string,
  status: string,
  checkWithdrawingDate: string
}
