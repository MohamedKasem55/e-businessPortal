import {BullionWeight} from "./gold-wallet-bullion-res";

export interface BuyGoldValidateReq {
    walletId: string;
    weight: number;
    qty: number;
    unit: BullionWeight;
    accountNumber: string;
    customWeight: boolean;
}
