export interface BaseTransactionList {
    myLastTransaction?: PagedResultGoldDetails;
    myGold?: PagedResultGoldDetails;
    myGoldFixed?: PagedResultGoldDetails;
    myGoldFree?: PagedResultGoldDetails;


}

// export interface GoldWalletTransactionsRes extends BaseTransactionList{
//     myGold: PagedResultGoldDetails;
// }

export interface SellTransactionsRes extends BaseTransactionList{
    myGoldFixed: PagedResultGoldDetails;
    myGoldFree: PagedResultGoldDetails;
}
export interface PagedResultGoldDetails {
    size: number;
    total: number;
    items: GoldDetails[];
}

export interface GoldDetails {
    amount: number;
    costPrice: number;
    gain?: number;
    goldCode: string;
    goldSource: string;
    purity: number;
    serialNumber: string;
    transactionDate: string;
    transactionStatus: string;
    transactionType: string;
    vendorName: string;
    customWeight: boolean;
}

