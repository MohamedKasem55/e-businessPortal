import { BaseResponse } from "../../common/base-response";

export interface EsalStatisticDetails extends BaseResponse {
    "invoiceStatistics": {
        sadadInvoiceStatisticsDetailsList: EsalInvoiceStatisticsDetails[],
        sadadInvoiceStatisticsHeaderDTO: EsalInvoiceStatisticsHeader
    }
}


export interface EsalInvoiceStatisticsDetails {
    "supplierName": string,
    "supplierID": string,
    "numberBills": number,
    "amountPaid": number
}

export interface EsalInvoiceStatisticsHeader {
    "recordType": string,
    "cicNumber": string,
    "numberBills": number,
    "totalAmount": number

}