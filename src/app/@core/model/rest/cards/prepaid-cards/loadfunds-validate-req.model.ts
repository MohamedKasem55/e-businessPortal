export interface PrepaidLoadFundsValidateReqModel {
    accountNumber: string;
    amount: string;
    cardAccountNumber: string;
    cardAccountSeqNumber: string;
    cardNumber: string;
    cardSeqNumber: string;
    equivalentAmount: number;
    feesAmount: number;
    typeOperation: string;
}