import { Injectable } from '@angular/core';
import { BuyGoldConfirmReq } from 'app/@core/model/rest/gold-wallet/buy-gold-confirm-req';
import { BuyGoldConfirmRes } from 'app/@core/model/rest/gold-wallet/buy-gold-confirm-res';
import { BuyGoldValidateReq } from 'app/@core/model/rest/gold-wallet/buy-gold-validate-req';
import { BuyGoldValidateRes } from 'app/@core/model/rest/gold-wallet/buy-gold-validate-res';
import { GoldWalletBullionRes } from 'app/@core/model/rest/gold-wallet/gold-wallet-bullion-res';
import { GoldWalletDashboardRes } from 'app/@core/model/rest/gold-wallet/gold-wallet-dashboard-res';
import { GoldWalletTransactionsReq } from 'app/@core/model/rest/gold-wallet/gold-wallet-transactions-req';
import { BaseTransactionList } from 'app/@core/model/rest/gold-wallet/gold-wallet-transactions-res';
import { OnBoardInitiateRes } from 'app/@core/model/rest/gold-wallet/onboard-initiate-res';
import { SellGoldConfirmReq } from 'app/@core/model/rest/gold-wallet/sell-gold-confirm-req';
import { SellGoldConfirmRes } from 'app/@core/model/rest/gold-wallet/sell-gold-confirm-res';
import { SellGoldPriceRes } from 'app/@core/model/rest/gold-wallet/sell-gold-price-res';
import { SellGoldValidateReq } from 'app/@core/model/rest/gold-wallet/sell-gold-validate-req';
import { SellGoldValidateRes } from 'app/@core/model/rest/gold-wallet/sell-gold-validate-res';
import { WalletOnBoardingConfirmReq } from 'app/@core/model/rest/gold-wallet/wallet-on-boarding-confirm-req';
import { WalletOnBoardingConfirmRes } from 'app/@core/model/rest/gold-wallet/wallet-on-boarding-confirm-res';
import {
  WalletOnBoardingValidationRequest
} from 'app/@core/model/rest/gold-wallet/wallet-on-boarding-validation-request';
import {
  WalletOnBoardingValidationResponse
} from 'app/@core/model/rest/gold-wallet/wallet-on-boarding-validation-response';
import { Observable } from "rxjs";
import { AbstractBaseService, ContextPath, RequestOption } from '../base/abstract-base.service';
import { GoldWalletConstants } from './gold-wallet-urls';

@Injectable()
export class GoldWalletService extends AbstractBaseService {

  getOnBoardInitiate(): Observable<OnBoardInitiateRes> {
    return this.get(GoldWalletConstants.ON_BOARDING_INITIATE);

      // return new Observable((observer: Subscriber<OnBoardInitiateRes>) => {

      // const res:OnBoardInitiateRes={
      //   errorDescription: '',
      //   errorResponse: {
      //       reference: '1f2b31a6-be4c-447d-9ad6-ccbbfe801f9b',
      //       englishMessage: '',
      //       arabicMessage: '',
      //       code: '',
      //       description: '',
      //   },
      //   hasExistingWallet: true,
      //   eligible: true
      // }
      //     setTimeout(()=>{
      //       observer.next(res);
      //     },500);
      //   });
  }

  getOnBoardValidate(validate: WalletOnBoardingValidationRequest): Observable<WalletOnBoardingValidationResponse> {
    return this.post(GoldWalletConstants.ON_BOARDING_VALIDATE, validate);
  }

  getOnBoardConfirm(confirm: WalletOnBoardingConfirmReq): Observable<WalletOnBoardingConfirmRes> {
    return this.post(GoldWalletConstants.ON_BOARDING_CONFRIM, confirm);
  }

  getTermsAndConditions(file: string) {
    const options: RequestOption = {contextPath: ContextPath.DOCUMENT_CONTEXT}
    this.getFile(file, file, true, options)
  }

  getDashboard(): Observable<GoldWalletDashboardRes> {
    return this.get(GoldWalletConstants.DASHBOARD);

    // return new Observable((observer: Subscriber<GoldWalletDashboardRes>) => {

    // const res:GoldWalletDashboardRes={
    //     walletNum: 'GL000000853494',
    //     linkedAccountNumber: '284000010006086039072',
    //     goldBalance: {
    //         balance: 50,
    //         measureUnit: "GRAM",
    //     },
    //     marketInformation: {
    //         marketPrice: 235,
    //         sellPrice: 239,
    //         buyPrice: 237,
    //         marketOpened: true,
    //     },
    //   }
    //   setTimeout(()=>{
    //     observer.next(res);
    //   },500);
    // });

  }

  getTransactions(response: GoldWalletTransactionsReq): Observable<BaseTransactionList> {
    return this.post(GoldWalletConstants.TRANSACTIONS, response, {hideLoader: true});
    // return new Observable((observer: Subscriber<BaseTransactionList>) => {

    //     const res:BaseTransactionList={
    //     myLastTransaction: {
    //       "size": 2,
    //       "total": 2,
    //       "items": [
    //         {
    //               "amount": 5,
    //               "serialNumber": "176864569",
    //               "goldCode": "D257500",
    //               "costPrice": 1158.01,
    //               "goldSource": "Switzerland",
    //               "vendorName": "MKS",
    //               "transactionType": "Sell",
    //               "transactionStatus": "Confirmed",
    //               "transactionDate": "2023-02-01",
    //               "purity": 999.9,
    //               "gain": undefined,
    //               "customWeight": true
    //         },
    //         {
    //               "amount": 5,
    //               "serialNumber": "176472888",
    //               "goldCode": "D257500",
    //               "costPrice": 1164.86,
    //               "goldSource": "Switzerland",
    //               "vendorName": "MKS",
    //               "transactionType": "Buy",
    //               "transactionStatus": "Confirmed",
    //               "transactionDate": "2023-01-31",
    //               "purity": 999.9,
    //               "gain": undefined,
    //               "customWeight": true
    //         }
    //       ]
    //     }
    //   }
    //     setTimeout(()=>{
    //       observer.next(res);
    //     },500);
    //   });
  }

  validate(response: BuyGoldValidateReq): Observable<BuyGoldValidateRes> {
    return this.post(GoldWalletConstants.BUY_VALIDATE, response);
    // return new Observable((observer: Subscriber<BuyGoldValidateRes>) => {

    //     const res:BuyGoldValidateRes={
    //       generateChallengeAndOTP: undefined,
    //       referenceNumber: '1121212',
    //       transactionKey: '444444',
    //       rate: 'rate',
    //       goldVendor: 'vendor',
    //       timeToLive: '180',
    //       totalCost: 1500,
    //       measureUnit: 'GRAM',
    //       weight: 5,
    //       qty: 1,
    //       purity: 999,
    //       goldSource: 'Spain',
    //     }
    //     setTimeout(()=>{
    //       observer.next(res);
    //     },500);
    //   });
  }

  confirm(response: BuyGoldConfirmReq): Observable<BuyGoldConfirmRes> {
    return this.post(GoldWalletConstants.BUY_CONFIRM, response);
    // return new Observable((observer: Subscriber<BuyGoldConfirmRes>) => {

    //    const res:BuyGoldConfirmRes={
    //       etId: '123123'
    //     }
    //     setTimeout(()=>{
    //       observer.next(res);
    //     },500);
    //   });
  }

  getAvailable(): Observable<GoldWalletBullionRes> {
    return this.get(GoldWalletConstants.BUY_AVAILABLE);
    // return new Observable((observer: Subscriber<GoldWalletBullionRes>) => {

    //   const res:GoldWalletBullionRes={
    //   availableFreeWeight: {
    //     balance: 1087936,
    //     measureUnit: "GRAM"
    //   },
    //   goldPrice: {
    //     goldBuyPrice: 223.86,
    //     enMeasureUnit: "GRAM",
    //     enCurrency: "SAR",
    //     arMeasureUnit: "جم",
    //     arCurrency: "ريال سعودي"
    //   },
    //   timeToLive: "180",
    //   gmbullionDtls: [],
    //   kgbullionDtls: [
    //     1000,
    //     1500
    //   ]
    // }
    //   setTimeout(()=>{
    //     observer.next(res);
    //   },500);
    // });
  }

  validateSell(response: SellGoldValidateReq): Observable<SellGoldValidateRes> {
    return this.post(GoldWalletConstants.SELL_VALIDATE, response);
    // return new Observable((observer: Subscriber<SellGoldValidateRes>) => {

    //    const res:SellGoldValidateRes={
    //       generateChallengeAndOTP: undefined,
    //       referenceNumber: '1121212',
    //       transactionKey: '444444',
    //       rate: 'rate',
    //       timeToLive: '180',
    //       totalCost: 1500,
    //       measureUnit: 'GRAM',
    //       weight: 5,
    //       qty: 1
    //     }
    //     setTimeout(()=>{
    //       observer.next(res);
    //     },500);
    //   });
  }

  confirmSell(response: SellGoldConfirmReq): Observable<SellGoldConfirmRes> {
    return this.post(GoldWalletConstants.SELL_CONFIRM, response);
    // return new Observable((observer: Subscriber<SellGoldConfirmRes>) => {

    //     const res:SellGoldConfirmRes={

    //   }
    //     setTimeout(()=>{
    //       observer.next(res);
    //     },500);
    //   });
  }

  getPrice(): Observable<SellGoldPriceRes> {
    return this.get(GoldWalletConstants.SELL_PRICE);
    // return new Observable((observer: Subscriber<SellGoldPriceRes>) => {

    //    const res: SellGoldPriceRes={
    //     goldSellPrice: 231.00
    //   }
    //     setTimeout(()=>{
    //       observer.next(res);
    //     },500);
    //   });
  }
}
