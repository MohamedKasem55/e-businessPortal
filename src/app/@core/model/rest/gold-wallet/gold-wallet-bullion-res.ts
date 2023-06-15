export interface GoldWalletBullionRes {
    availableFreeWeight: MaxWeight;
    goldPrice: GoldPrice;
    timeToLive: string;
    gmbullionDtls: number[];
    kgbullionDtls: number[];
}

export interface GoldPrice {
    arCurrency: string
    arMeasureUnit: string
    enCurrency: string
    enMeasureUnit: string
    goldBuyPrice: number
}

export interface MaxWeight {
    balance: number;
    measureUnit: string;
}

export interface Bullion {
    weight: number;
    currency: BullionWeight;
}

export enum BullionWeight {
    GRAM = "GRAM", KG = "KG", GM = "GM"
}
