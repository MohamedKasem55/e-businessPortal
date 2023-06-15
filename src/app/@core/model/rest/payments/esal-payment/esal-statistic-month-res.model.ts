import { BaseResponse } from "../../common/base-response";

export interface EsalStatisticMonthlyList extends BaseResponse {
    sadadInvoiceYearMonthDTOlist: EsalInvoiceYearMonth[];
  }


export interface EsalInvoiceYearMonth{
    year:string
    month:string
    date:string
}