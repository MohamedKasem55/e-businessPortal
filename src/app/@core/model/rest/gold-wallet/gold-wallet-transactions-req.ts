export interface GoldWalletTransactionsReq {
    page: number;
    rows: number;
    filterType?: GoldWalletFilterType;
    walletNum?: string;
}

export enum GoldWalletFilterType {
    MY_GOLD = 'MY_GOLD', LAST_TRANSACTION = 'LAST_TRANSACTION', ALL = 'ALL', MY_GOLD_SEG = 'MY_GOLD_SEG'
}
