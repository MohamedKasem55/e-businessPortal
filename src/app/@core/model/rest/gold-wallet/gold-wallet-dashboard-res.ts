export interface GoldWalletDashboardRes {
    walletNum: string;
    linkedAccountNumber: string;
    goldBalance: GoldBalance;
    marketInformation: MarketInformation;
}

interface GoldBalance {
    balance: number;
    measureUnit: string;
}

export enum MeasureUnit {
    GRAM='GRAM', KG='KG'
}

interface MarketInformation {
    marketPrice: number;
    sellPrice: number;
    buyPrice: number;
    marketOpened: boolean;
}
