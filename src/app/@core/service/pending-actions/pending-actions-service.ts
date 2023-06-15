import { Injectable } from "@angular/core";
import { AbstractBaseService, RequestOption } from "../base/abstract-base.service";
import { map, Observable } from "rxjs";
import { PendingActionsConstants } from "./pending-actions-service-urls";
import { UserAccountsResModel } from "app/@core/model/rest/Pending-actions/user-accounts-res.model";
import { UserAccountsReqModel } from "app/@core/model/rest/Pending-actions/user-levels-req.model";
import { PendingActionPage } from "app/@core/model/dto/pending-actions-model";
import { UserNonFinancialResModel } from "app/@core/model/rest/Pending-actions/user-non-financial-res.model";


@Injectable()
export class PendingActionsService extends AbstractBaseService {
  pendingAction!: PendingActionPage;

  getCounters(): { [key: string]: number } {
    return JSON.parse(sessionStorage.getItem("counters")!);
  }

  setCounters(counters: { [key: string]: number }): any {
    sessionStorage.setItem("counters", JSON.stringify(counters));
  }


  getPendingActionCounts(): Observable<{ [key: string]: number }> {
    return this.get(PendingActionsConstants.COUNTERS, { hideLoader: true, silentError: true })
      .pipe(map(data => {
        let notification: { [key: string]: number } = {};
        this.setCounters(data.counter);
        Object.keys(data.counter).forEach((key) => {
          let id = getCounterIdMatrix()[key];
          if (id) {
            if (!notification[id]) {
              notification[id] = data.counter[key];
            } else {
              notification[id] = notification[id] + data.counter[key];
            }
          }
        });
        return notification;
      }));
  }

  getPendingActionsService(url: string, paramList: any,options?:RequestOption): Observable<any> {  return this.post(url, paramList, { hideLoader: true,...options });}

  postPendingActionsService(url: string, paramList: any): Observable<any> {
    return this.post(url, paramList);
  }

  putPendingActionsService(url: string, paramList: any): Observable<any> {
    return this.put(url, paramList);
  }

  getUserAccount(): Observable<UserAccountsResModel> {
    return this.get(PendingActionsConstants.USERACCOUNTS);
  }

  getUserAccountsLevels(paramList: UserAccountsReqModel): Observable<UserAccountsResModel> {
    return this.post(PendingActionsConstants.USERACCOUNTSLEVELS, paramList);
  }

  getUserNonFinancialLevels(paramList: UserAccountsReqModel): Observable<UserNonFinancialResModel> {
    return this.post(PendingActionsConstants.USERNONFINANCIALLEVELS, paramList);
  }

  setPendingAction(pendingAction: PendingActionPage) {
    this.pendingAction = pendingAction;
  }

  getPendingAction(): PendingActionPage {
    return this.pendingAction
  }

  getIVRRequestStatus(callBackRequestId: string) {
    return this.post(PendingActionsConstants.IVR_REQUEST_STATUS.replace('{{id}}', callBackRequestId), {});
  }

}


export const getCounterIdMatrix = (): any => {
  return {

    /////////////pos
    posManagementCount: '',
    posMaintenanceCount: 'pos',
    // posManagements: 'pos',
    posRequestCount: 'pos',
    posClaimCount: 'pos',
    ///////////////////////


    ////// billPay
    billPay: '',
    billPayment: 'bills',
    billPayAdd: 'bills',

    //////////////////

    ////////////////// esal
    saddadInvoice: 'esal',
    //////////////////

    ///////////
    eGovSadad: '',
    eGovSadadPayments: 'moi',
    eGovSadadRefund: 'moi',
    // ///////////


    ////////cards
    prepaidCards: 'cards',
    businessCards: 'cards',
    //////////////


    //// transfer
    interTransfer: 'transfer',
    localTransfer: 'transfer',
    ownTransfer: 'transfer',
    withinTransfer: 'transfer',
    //////////

    //bulkPayments


    // beneficiary
    beneficiary: '',
    localBeneficiary: 'beneficiary',
    withinBeneficiary: 'beneficiary',
    internationalBeneficiary: 'beneficiary',
    ///////////////////////

    /////////// Not Implemented yet
    localBeneficiaryInactive: '',
    withinBeneficiaryInactive: '',
    beneficiaryInactive: '',

    //// chequebook
    chequeManagement: '',
    stopCheckBookGroup: 'chequebook',
    positivePayCheck: 'chequebook',
    requestCheckBook: 'chequebook',
    /////


    // ////////// payroll
    // payroll: 'payroll',
    // //////////
    //
    //
    // ////////// payroll-plus
    wpsPlusEmployee: 'payroll-plus',
    wpsPlusPayment: 'payroll-plus',
    // ////////////////
    //
    //
    // ////////// wpsPayroll
    // wpsPayroll: "",
    wpsPayrollUploadFile: "wpsPayroll",
    wpsPayrollPayment: "wpsPayroll",
    // /////

    ///////////payrollCards
    //payrollCards:'',
    //payrollCard:'payrollCards',
    //payrollCardOperation	 'payrollCards',
    //payrollCards	 'payrollCards',
    //payrollCardPay	 'payrollCards',
    //payrollCardUpload: 'payrollCards',
    //////////////////////

    //wmsPayroll	 '',


    balanceCertificate: 'balanceCertificate',
    aramco: 'aramco',
    standingOrders: 'standingOrders',

    //workflow: 'workflow' /////Admin && Dual Authorization
    //users: 'users' /////Admin && Dual Authorization
    //orderSoftToken: 'orderSoftToken' /////Admin && Dual Authorization

    //govRevenue	 "govRevenue",
    //govRevenueFile

    //olpRefund	 '',

    //olpDisputes	 '',

    //mutualFund


    ///letterGuarantee

    //directDebits	 '',
    //directDebitUpload	 'directDebits',
    //directDebit	 'directDebits',


    ////hajjUmrahCards
    //// hajjUmrahCards:'',
    //hajjUmrahAllocationCard	 'hajjUmrahCards',
    //hajjUmrahCardOperation	 'hajjUmrahCards',


  }
}
/**
 *  this enum is controlling the order of pending actions on the dashboard as the following example
 *
 *    TRANSFER = 'transfer', -> first element in the list
 *    STANDING_ORDERS = 'standingOrders', -> second
 *    BILLS = 'bills',  -> third
 *
 *
 *    others on the same way ....
 */
export enum MostPriortyActionsIds {
  TRANSFER = 'transfer',
  MOI = 'moi',
  STANDING_ORDERS = 'standingOrders',
  BILLS = 'bills',
  PAYROLL = 'payroll',
  WPS_PAYROLLS = 'wpsPayroll',
  BENEFICIARY = 'beneficiary',
  POS = 'pos',
  ESAL = 'esal'
}
