export interface TransferReasonReqModel {
    transferPurposeType: string
    remitterCategory?: string,
    currencyCode?: string,
    beneficiaryCategory?: string,
    payCode?: string
}
