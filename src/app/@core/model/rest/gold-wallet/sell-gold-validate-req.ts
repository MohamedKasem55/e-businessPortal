export interface SellGoldValidateReq {
    walletId: string;
    bullionLst: BullionItem[]
    accountNumber: string;

}


export interface BullionItem {
    goldCode: string
    weight: number
    customWeight: boolean
}
