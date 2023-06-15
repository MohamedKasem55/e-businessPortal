export interface FxRatesRequestReq {
  baseAmount: number;
  fromCurrencyCode?: string;
  toCurrencyCode?: string;
}

export interface FxRatesRes {
  key: string,
  location: string,
  name: string,
  props: { key: string, value: string }
}

export interface FxRatesCurrenciesAndIso {
  code: string,
  currecy: string,
  iso: string,
  currencyWithIso: string
}

export interface currencesAndSellBuyPrice {
  currencyCode: string,
  currency?: string,
  iso?: string,
  buyPrice: string,
  sellPrice: string,
  image?: string
}

export interface fxRatesModel {
  currencyCode: string,
  buyPrice: string,
  sellPrice: string
}

export interface fxRatesRes {
  exchangeValue: string,
  fxRatesList: fxRatesModel[],
  generateChallengeAndOTP: string,
  targetAmount: string
}
