import {
  PendingActionModel,
  PendingActionPage,
  PendingActionPagination, ValidatePendingActionsResponse, WorkflowType
} from "../../../@core/model/dto/pending-actions-model";
import { PendingActionsService } from "../../../@core/service/pending-actions/pending-actions-service";
import { DatePipe } from "@angular/common";
import { TabModel } from "arb-design-library/model/tab.model";
import { Observable, Subscriber } from "rxjs";
import { RequestValidate } from "../../../@core/model/rest/common/otp.model";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";
import { TableHeaderType } from "arb-design-library";
import { getCurrentLevelControlOptions } from "./current-level-control-options";
import { SummarySectionModel, SummaryTable } from "arb-design-library/model/summary-section.model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { Batch, BatchList } from "app/@core/model/rest/common/batchResponse";
import { RequestOption } from "app/@core/service/base/abstract-base.service";
import { HttpParams } from "@angular/common/http";
import { AmountTitleModel } from "arb-design-library/model/amount-title.model";

export class TransfersPendingActionsPage implements PendingActionPage {

  constructor(private pendingActionsService: PendingActionsService, private datePipe: DatePipe, private counters: { [key: string]: number }) {
  }

  workflowType: WorkflowType[] = [{
    type: 'TO',
    isFinancial: true,
    text: "pending-actions.own-transfer",
  }, {
    type: 'TW',
    isFinancial: true,
    text: "pending-actions.within-transfer",
  }, {
    type: 'TL',
    isFinancial: true,
    text: "pending-actions.local-transfer",
  }, {
    type: 'TI',
    isFinancial: true,
    text: "pending-actions.international-transfer",
  }];

  tabs: TabModel[] = buildTabs(this.counters);
  workflowTabs: TabModel[] = buildTabs();
  pendingActions: PendingActionModel[] = buildPendingAction(this.pendingActionsService, this.datePipe, this.counters);
  title = "pending-actions.transfer-title";
  subtitle = 'pending-actions.transfer-subtitle'
}

export function buildPendingAction(pendingActionsService: PendingActionsService, datePipe: DatePipe, counters: any): PendingActionModel[] {
  let pendingActions: PendingActionModel[] = [];
  if (counters) {
    if (counters.hasOwnProperty('ownTransfer'))
      pendingActions.push(new OwnTransfersPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('withinTransfer'))
      pendingActions.push(new WithinTransfersPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('localTransfer'))
      pendingActions.push(new LocalTransfersPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('interTransfer'))
      pendingActions.push(new InternationalTransfersPendingAction(pendingActionsService, datePipe))
  }
  return pendingActions;
}

export function buildTabs(counters?: any): TabModel[] {
  let tabs: TabModel[] = [];
  let tabCount: number = 0;
  if (counters) {
    if (counters.hasOwnProperty('ownTransfer')) {
      tabs.push({ icon: 'arb-icon-userAlrajhi', text: "pending-actions.own-transfer", value: tabCount.toString() })
      tabCount++
    }
    if (counters.hasOwnProperty('withinTransfer')) {
      tabs.push({ icon: 'arb-icon-Alrajhi', text: "pending-actions.within-transfer", value: tabCount.toString() })
      tabCount++
    }
    if (counters.hasOwnProperty('localTransfer')) {
      tabs.push({ icon: 'arb-icon-saudiBold', text: "pending-actions.local-transfer", value: tabCount.toString() })
      tabCount++
    }
    if (counters.hasOwnProperty('interTransfer')) {
      tabs.push({ icon: 'arb-icon-world', text: "pending-actions.international-transfer", value: tabCount.toString() })
      tabCount++
    }
  } else {
    tabs.push(
      {
        text: "pending-actions.own-transfer",
        value: "0",
      },
      {
        text: "pending-actions.within-transfer",
        value: "1",
      },
      {
        text: "pending-actions.local-transfer",
        value: "2",
      },
      {
        text: "pending-actions.international-transfer",
        value: "3",
      });
  }
  return tabs;
}

export class LocalTransfersPendingAction extends PendingActionModel {
  override serviceMapObjects = ["bankCode", "countryName", "backEndCountryCode", "batchTypes", "currency"];

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-transfer-approved";
  override successRejectMessage = "pending-actions.selected-transfer-rejected";
  override showSariaLogo = true;

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let newData: any = data;
      newData['pending'] = true;
      let options: RequestOption = { requestParams: new HttpParams().append("transferTypes", "LOCAL_TRANSFER") }
      this.pendingActionsService.getPendingActionsService("transfers/batch/list", newData, options).subscribe(res => {
        res['transfers']['items'].map(function (transfer: any, index: string | number) {
          transfer['alias'] = transfer['accountFrom']['alias'];
          transfer['debitAmountcurrency'] = transfer['country'];
          transfer['fullAccountNumber'] = transfer['accountFrom']['fullAccountNumber'];
        });
        res['transfers']['items'] = res['transfers']['items'].filter((transfer: any) => transfer['batchType'] === 'TL' || transfer['batchType'] === 'TL-URPAY')
        observer.next(res.transfers);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/validate", {
        batchList: data,
        segment: '0000'
      }).subscribe(res => {
        const batchs = getBatchValidateSelected(res);
        getExtraFields(data, batchs)
        batchs['ownAuthorizationPermission'] = res['ownAuthorizationPermission']
        batchs['localAuthorizationPermission'] = res['localAuthorizationPermission']
        batchs['internationalAuthorizationPermission'] = res['internationalAuthorizationPermission']
        batchs['withinAuthorizationPermission'] = res['withinAuthorizationPermission']
        res['batchList'] = null;
        const total: any = {
          requiredSFA: res['requiredSFA'],
          totalAmountAuthorize: res['totalAmountAuthorize'],
          totalAmountNotAllowed: res['totalAmountNotAllowed'],
          totalAmountProcess: res['totalAmountProcess'],
          totalFeeAuthorize: res['totalFeeAuthorize'],
          totalFeeNotAllowed: res['totalFeeNotAllowed'],
          totalFeeProcess: res['totalFeeProcess']
        }
        res['batchList'] = batchs
        res['generateChallengeAndOTP'] = res['generateChallengeAndOTP'];
        res['batchList']['total'] = total;
        observer.next(res);
      });
    });
  }


  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/confirm", {
        batchListAlrajhi: data['withinAuthorizationPermission'],
        batchListOwn: data['ownAuthorizationPermission'],
        batchListLocal: data['localAuthorizationPermission'],
        batchListInternational: data['internationalAuthorizationPermission'],
        requestValidate,
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  override getText(item: TableHeaderModel, data: any) {
    return {
      title: item.title,
      subTitle: getSubtitle(item, data)
    }
  }

  override getAmount(item: TableHeaderModel, data: any) {
    return {
      title: item.title,
      subTitle: getSubtitle(item, data),
      currency: item.controlOptions?.currency ? data[item.controlOptions?.currency] ? data[item.controlOptions?.currency] : '608' : '608'
    }
  }

  override buildSummaryPage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let summary: SummaryModel = super.buildSummaryPage(title, isApprove, data, headers);
    if (isApprove && data && data['total']) {
      summary.sections!.unshift(createSummaryItemAmount(data));
    }
    return summary
  }

  override buildTablePage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    title = "pending-actions.summary"
    let summarySubTitle = "";
    if (isApprove) {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: []
      }
      if (data.toProcess.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-will-be-complete' },
          table: this.getSummaryTable(data.toProcess, headers, isApprove),
        });
      }
      if (data.toAuthorize && data.toAuthorize?.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-will-approved' },
          table: this.getSummaryTable(data.toAuthorize, headers, isApprove),
        });
      }
      if (data.notAllowed.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-not-allowed' },
          table: this.getSummaryTable(data.notAllowed, headers, isApprove),
        });
      }

      if (isApprove && data && data['total']) {
        summary.sections!.unshift(createSummaryItemAmount(data));
      }

      return summary;
    } else {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: [
          {
            title: { id: "", title: 'pending-actions.actions-will-be-reject' },
            table: this.getSummaryTable(data.toReject, headers, isApprove),
          }]
      }
      if (isApprove && data && data['total']) {
        summary.sections!.unshift(createSummaryItemAmount(data));
      }
      return summary;
    }
  }

  override getSummaryTable(data: any, headers: any[], isApprove: boolean): SummaryTable {
      if (isApprove) {
      headers.find(a => a.title === "pending-actions.current-level").fieldName = 'futureSecurityLevelsDTOList'
      headers.find(a => a.title === "pending-actions.next-level").fieldName = 'futureSecurityLevelsDTOList'
    } else {
      headers.find(a => a.title === "pending-actions.current-level").fieldName = 'securityDetails'
      headers.find(a => a.title === "pending-actions.next-level").fieldName = 'securityDetails'
    }
    return {
      columnId: "batchPk",
      headers: headers,
      maxDisplayRow: 5,
      data,
    }
  }

  rejectPendingActions(data: any, reason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/refuse", {
        batchTransfers: data,
        reason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.transfer-type",
      type: TableHeaderType.TEXT,
      fieldName: 'batchType',
      mapObject: 'batchTypes',
    },
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate',

    },
    {
      title: "pending-actions.from-account",
      type: TableHeaderType.TEXT,
      fieldName: 'fullAccountNumber',
    },
    {
      title: "pending-actions.debit-account-nickname",
      type: TableHeaderType.TEXT,
      fieldName: 'alias',
    },
    {
      title: "pending-actions.beneficiary-name",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryName',
    },
    {
      title: "pending-actions.beneficiary-account",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryAccount',
    },
    {
      title: "pending-actions.beneficiary-bank",
      type: TableHeaderType.TEXT,
      fieldName: 'bankName',
    },
    {
      title: "pending-actions.country",
      type: TableHeaderType.TEXT,
      fieldName: 'country',
      mapObject: 'backEndCountryCode',
    },
    {
      title: "pending-actions.debit-amount",
      fieldName: 'debitAmount',
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {
        currency: 'debitAmountcurrency'
      }
    },
    {
      title: "pending-actions.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: 'amount',
      controlOptions: {
        currency: 'currency'
      }
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityDetails",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityDetails",
      controlOptions: { completed: "payments.userApproval.completed" }
    }
  ];
}

export class WithinTransfersPendingAction extends PendingActionModel {
  override serviceMapObjects = ["bankCode", "countryName", "backEndCountryCode", "batchTypes", "currency"];

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-transfer-approved";
  override successRejectMessage = "pending-actions.selected-transfer-rejected";


  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let newData: any = data;
      newData['pending'] = true;
      let options: RequestOption = { requestParams: new HttpParams().append("transferTypes", "WITHIN_TRANSFER") }
      this.pendingActionsService.getPendingActionsService("transfers/batch/list", newData, options).subscribe(res => {
        res['transfers']['items'].map(function (transfer: any, index: string | number) {
          transfer['debitAmountcurrency'] = transfer['country'];
          transfer['alias'] = transfer['accountFrom']['alias'];
          transfer['fullAccountNumber'] = transfer['accountFrom']['fullAccountNumber'];
        });

        res['transfers']['items'] = res['transfers']['items'].filter((transfer: any) => transfer['batchType'] === 'TW')
        observer.next(res.transfers);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/validate", {
        batchList: data,
        segment: '2060'
      }).subscribe(res => {
        const batchs = getBatchValidateSelected(res);
        getExtraFields(data, batchs)
        batchs['ownAuthorizationPermission'] = res['ownAuthorizationPermission']
        batchs['localAuthorizationPermission'] = res['localAuthorizationPermission']
        batchs['internationalAuthorizationPermission'] = res['internationalAuthorizationPermission']
        batchs['withinAuthorizationPermission'] = res['withinAuthorizationPermission']
        res['batchList'] = null;
        const total: any = {
          requiredSFA: res['requiredSFA'],
          totalAmountAuthorize: res['totalAmountAuthorize'],
          totalAmountNotAllowed: res['totalAmountNotAllowed'],
          totalAmountProcess: res['totalAmountProcess'],
          totalFeeAuthorize: res['totalFeeAuthorize'],
          totalFeeNotAllowed: res['totalFeeNotAllowed'],
          totalFeeProcess: res['totalFeeProcess']
        }
        res['batchList'] = batchs
        res['generateChallengeAndOTP'] = res['generateChallengeAndOTP'];
        res['batchList']['total'] = total;
        observer.next(res);
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/confirm", {
        batchListAlrajhi: data['withinAuthorizationPermission'],
        batchListOwn: data['ownAuthorizationPermission'],
        batchListLocal: data['localAuthorizationPermission'],
        batchListInternational: data['internationalAuthorizationPermission'],
        requestValidate,
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  override getText(item: TableHeaderModel, data: any) {
    return {
      title: item.title,
      subTitle: getSubtitle(item, data)
    }
  }

  override getAmount(item: TableHeaderModel, data: any) {
    return {
      title: item.title,
      subTitle: getSubtitle(item, data),
      currency: item.controlOptions?.currency ? data[item.controlOptions?.currency] ? data[item.controlOptions?.currency] : '608' : '608'
    }
  }

  override buildSummaryPage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let summary: SummaryModel = super.buildSummaryPage(title, isApprove, data, headers);
    if (isApprove && data && data['total']) {
      summary.sections!.unshift(createSummaryItemAmount(data));
    }
    return summary
  }

  override buildTablePage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    title = "pending-actions.summary"
    let summarySubTitle = "";

    if (isApprove) {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: []
      }
      if (data.toProcess.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-will-be-complete' },
          table: this.getSummaryTable(data.toProcess, headers),
        });
      }
      if (data.toAuthorize && data.toAuthorize?.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-will-approved' },
          table: this.getSummaryTable(data.toAuthorize, headers),
        });
      }
      if (data.notAllowed.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-not-allowed' },
          table: this.getSummaryTable(data.notAllowed, headers),
        });
      }

      if (isApprove && data && data['total']) {
        summary.sections!.unshift(createSummaryItemAmount(data));
      }
      return summary;
    } else {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: [
          {
            title: { id: "", title: 'pending-actions.actions-will-be-reject' },
            table: this.getSummaryTable(data.toReject, headers),
          }]
      }
      if (isApprove && data && data['total']) {
        summary.sections!.unshift(createSummaryItemAmount(data));
      }
      return summary;
    }
  }

  override getSummaryTable(data: any, headers: any[]): SummaryTable {
    return {
      columnId: "batchPk",
      headers: headers,
      maxDisplayRow: 5,
      ShowMoreText: "Show More",
      ShowLessText: "Show Less",
      data,
    }
  }

  rejectPendingActions(data: any, reason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/refuse", {
        batchTransfers: data,
        reason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate',

    },
    {
      title: "pending-actions.from-account",
      type: TableHeaderType.TEXT,
      fieldName: 'fullAccountNumber',
    },
    {
      title: "pending-actions.debit-account-nickname",
      type: TableHeaderType.TEXT,
      fieldName: 'alias',
    },
    {
      title: "pending-actions.beneficiary-name",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryName',
    },
    {
      title: "pending-actions.beneficiary-account",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryAccount',
    },
    {
      title: "pending-actions.beneficiary-bank",
      type: TableHeaderType.TEXT,
      fieldName: 'bankName',
    },
    {
      title: "pending-actions.country",
      type: TableHeaderType.TEXT,
      fieldName: 'country',
      mapObject: 'backEndCountryCode',
    },
    {
      title: "pending-actions.debit-amount",
      fieldName: 'debitAmount',
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {
        currency: 'debitAmountcurrency'
      }
    },
    {
      title: "pending-actions.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: 'amount',
      controlOptions: {
        currency: 'currency'
      }
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityDetails",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityDetails",
      controlOptions: { completed: "payments.userApproval.completed" }
    }
  ];
}


export class InternationalTransfersPendingAction extends PendingActionModel {
  override serviceMapObjects = ["bankCode", "countryName", "backEndCountryCode", "batchTypes", "currency"];

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-transfer-approved";
  override successRejectMessage = "pending-actions.selected-transfer-rejected";


  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let newData: any = data;
      newData['pending'] = true;
      let options: RequestOption = { requestParams: new HttpParams().append("transferTypes", "INTERNATIONAL_TRANSFER") }
      this.pendingActionsService.getPendingActionsService("transfers/batch/list", newData, options).subscribe(res => {
        res['transfers']['items'].map(function (transfer: any, index: string | number) {
          transfer['debitAmountcurrency'] = '608';
          transfer['alias'] = transfer['accountFrom']['alias'];
          transfer['fullAccountNumber'] = transfer['accountFrom']['fullAccountNumber'];
        });

        res['transfers']['items'] = res['transfers']['items'].filter((transfer: any) => transfer['batchType'] === 'TI')
        observer.next(res.transfers);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/validate", {
        batchList: data,
        segment: '0000'
      }).subscribe(res => {
        const batchs = getBatchValidateSelected(res);
        getExtraFields(data, batchs)
        batchs['ownAuthorizationPermission'] = res['ownAuthorizationPermission']
        batchs['localAuthorizationPermission'] = res['localAuthorizationPermission']
        batchs['internationalAuthorizationPermission'] = res['internationalAuthorizationPermission']
        batchs['withinAuthorizationPermission'] = res['withinAuthorizationPermission']
        res['batchList'] = null;
        const total: any = {
          requiredSFA: res['requiredSFA'],
          totalAmountAuthorize: res['totalAmountAuthorize'],
          totalAmountNotAllowed: res['totalAmountNotAllowed'],
          totalAmountProcess: res['totalAmountProcess'],
          totalFeeAuthorize: res['totalFeeAuthorize'],
          totalFeeNotAllowed: res['totalFeeNotAllowed'],
          totalFeeProcess: res['totalFeeProcess']
        }
        res['batchList'] = batchs
        res['generateChallengeAndOTP'] = res['generateChallengeAndOTP'];
        res['batchList']['total'] = total;
        observer.next(res);
      });
    });
  }


  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/confirm", {
        batchListAlrajhi: data['withinAuthorizationPermission'],
        batchListOwn: data['ownAuthorizationPermission'],
        batchListLocal: data['localAuthorizationPermission'],
        batchListInternational: data['internationalAuthorizationPermission'],
        requestValidate,
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  override getText(item: TableHeaderModel, data: any) {
    return {
      title: item.title,
      subTitle: getSubtitle(item, data)
    }
  }

  override getAmount(item: TableHeaderModel, data: any) {
    return {
      title: item.title,
      subTitle: getSubtitle(item, data),
      currency: item.controlOptions?.currency ? data[item.controlOptions?.currency] ? data[item.controlOptions?.currency] : '608' : '608'
    }
  }

  override buildSummaryPage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let summary: SummaryModel = super.buildSummaryPage(title, isApprove, data, headers);
    if (isApprove && data && data['total']) {
      summary.sections!.unshift(createSummaryItemAmount(data));
    }
    return summary
  }

  override buildTablePage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    title = "pending-actions.summary"
    let summarySubTitle = "";

    if (isApprove) {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: []
      }
      if (data.toProcess.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-will-be-complete' },
          table: this.getSummaryTable(data.toProcess, headers),
        });
      }
      if (data.toAuthorize && data.toAuthorize?.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-will-approved' },
          table: this.getSummaryTable(data.toAuthorize, headers),
        });
      }
      if (data.notAllowed.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-not-allowed' },
          table: this.getSummaryTable(data.notAllowed, headers),
        });
      }

      if (isApprove && data && data['total']) {
        summary.sections!.unshift(createSummaryItemAmount(data));
      }

      return summary;
    } else {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: [
          {
            title: { id: "", title: 'pending-actions.actions-will-be-reject' },
            table: this.getSummaryTable(data.toReject, headers),
          }]
      }
      if (isApprove && data && data['total']) {
        summary.sections!.unshift(createSummaryItemAmount(data));
      }
      return summary;
    }
  }

  override getSummaryTable(data: any, headers: any[]): SummaryTable {
    return {
      columnId: "batchPk",
      headers: headers,
      maxDisplayRow: 5,
      ShowMoreText: "Show More",
      ShowLessText: "Show Less",
      data,
    }
  }

  rejectPendingActions(data: any, reason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/refuse", {
        batchTransfers: data,
        reason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate',

    },
    {
      title: "pending-actions.from-account",
      type: TableHeaderType.TEXT,
      fieldName: 'fullAccountNumber',
    },
    {
      title: "pending-actions.debit-account-nickname",
      type: TableHeaderType.TEXT,
      fieldName: 'alias',
    },
    {
      title: "pending-actions.beneficiary-name",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryName',
    },
    {
      title: "pending-actions.beneficiary-account",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryAccount',
    },
    {
      title: "pending-actions.beneficiary-bank",
      type: TableHeaderType.TEXT,
      fieldName: 'bankName',
    },
    {
      title: "pending-actions.country",
      type: TableHeaderType.TEXT,
      fieldName: 'country',
      mapObject: 'backEndCountryCode',
    },
    {
      title: "pending-actions.debit-amount",
      fieldName: 'debitAmount',
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {
        currency: 'debitAmountcurrency'
      }
    },
    {
      title: "pending-actions.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: 'amount',
      controlOptions: {
        currency: 'currency'
      }
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityDetails",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityDetails",
      controlOptions: { completed: "payments.userApproval.completed" }
    }
  ];
}


export class OwnTransfersPendingAction extends PendingActionModel {
  override serviceMapObjects = ["bankCode", "countryName", "backEndCountryCode", "batchTypes", "currency"];

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-transfer-approved";
  override successRejectMessage = "pending-actions.selected-transfer-rejected";


  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let newData: any = data;
      newData['pending'] = true;
      let options: RequestOption = { requestParams: new HttpParams().append("transferTypes", "OWN_TRANSFER") }
      newData['pending'] = true;
      this.pendingActionsService.getPendingActionsService("transfers/batch/list", newData, options).subscribe(res => {
        res['transfers']['items'].map(function (transfer: any, index: string | number) {

          transfer['alias'] = transfer['accountFrom']['alias'];
          transfer['debitAmountcurrency'] = transfer['country'];
          transfer['fullAccountNumber'] = transfer['accountFrom']['fullAccountNumber'];
        });

        res['transfers']['items'] = res['transfers']['items'].filter((transfer: any) => transfer['batchType'] === 'TO')
        observer.next(res.transfers);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/validate", {
        batchList: data,
        segment: '2060'
      }).subscribe(res => {
        const batchs = getBatchValidateSelected(res);
        getExtraFields(data, batchs)
        batchs['ownAuthorizationPermission'] = res['ownAuthorizationPermission']
        batchs['localAuthorizationPermission'] = res['localAuthorizationPermission']
        batchs['internationalAuthorizationPermission'] = res['internationalAuthorizationPermission']
        batchs['withinAuthorizationPermission'] = res['withinAuthorizationPermission']
        res['batchList'] = null;
        const total: any = {
          requiredSFA: res['requiredSFA'],
          totalAmountAuthorize: res['totalAmountAuthorize'],
          totalAmountNotAllowed: res['totalAmountNotAllowed'],
          totalAmountProcess: res['totalAmountProcess'],
          totalFeeAuthorize: res['totalFeeAuthorize'],
          totalFeeNotAllowed: res['totalFeeNotAllowed'],
          totalFeeProcess: res['totalFeeProcess']
        }
        res['batchList'] = batchs
        res['generateChallengeAndOTP'] = res['generateChallengeAndOTP'];
        res['batchList']['total'] = total;
        observer.next(res);
      });
    });
  }


  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/confirm", {
        batchListAlrajhi: data['withinAuthorizationPermission'],
        batchListOwn: data['ownAuthorizationPermission'],
        batchListLocal: data['localAuthorizationPermission'],
        batchListInternational: data['internationalAuthorizationPermission'],
        requestValidate,
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  override getText(item: TableHeaderModel, data: any) {
    return {
      title: item.title,
      subTitle: getSubtitle(item, data)
    }
  }

  override getAmount(item: TableHeaderModel, data: any) {
    return {
      title: item.title,
      subTitle: getSubtitle(item, data),
      currency: item.controlOptions?.currency ? data[item.controlOptions?.currency] ? data[item.controlOptions?.currency] : '608' : '608'
    }
  }

  override buildSummaryPage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let summary: SummaryModel = super.buildSummaryPage(title, isApprove, data, headers);
    if (isApprove && data && data['total']) {
      summary.sections!.unshift(createSummaryItemAmount(data));
    }
    return summary
  }

  override buildTablePage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    title = "pending-actions.summary"
    let summarySubTitle = "";

    if (isApprove) {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: []
      }
      if (data.toProcess.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-will-be-complete' },
          table: this.getSummaryTable(data.toProcess, headers),
        });
      }
      if (data.toAuthorize && data.toAuthorize?.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-will-approved' },
          table: this.getSummaryTable(data.toAuthorize, headers),
        });
      }
      if (data.notAllowed.length > 0) {
        summary.sections?.push({
          title: { id: "", title: 'pending-actions.actions-not-allowed' },
          table: this.getSummaryTable(data.notAllowed, headers),
        });
      }

      if (isApprove && data && data['total']) {
        summary.sections!.unshift(createSummaryItemAmount(data));
      }

      return summary;
    } else {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: [
          {
            title: { id: "", title: 'pending-actions.actions-will-be-reject' },
            table: this.getSummaryTable(data.toReject, headers),
          }]
      }
      if (isApprove && data && data['total']) {
        summary.sections!.unshift(createSummaryItemAmount(data));
      }
      return summary;
    }
  }

  override getSummaryTable(data: any, headers: any[]): SummaryTable {
    return {
      columnId: "batchPk",
      headers: headers,
      maxDisplayRow: 5,
      ShowMoreText: "Show More",
      ShowLessText: "Show Less",
      data,
    }
  }

  rejectPendingActions(data: any, reason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("transfers/pendingActions/refuse", {
        batchTransfers: data,
        reason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate',

    },
    {
      title: "pending-actions.from-account",
      type: TableHeaderType.TEXT,
      fieldName: 'fullAccountNumber',
    },
    {
      title: "pending-actions.debit-account-nickname",
      type: TableHeaderType.TEXT,
      fieldName: 'alias',
    },
    {
      title: "pending-actions.beneficiary-name",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryName',
    },
    {
      title: "pending-actions.beneficiary-account",
      type: TableHeaderType.TEXT,
      fieldName: 'beneficiaryAccount',
    },
    {
      title: "pending-actions.beneficiary-bank",
      type: TableHeaderType.TEXT,
      fieldName: 'bankName',
    },
    {
      title: "pending-actions.country",
      type: TableHeaderType.TEXT,
      fieldName: 'country',
      mapObject: 'backEndCountryCode',
    },
    {
      title: "pending-actions.debit-amount",
      fieldName: 'debitAmount',
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {
        currency: 'debitAmountcurrency'
      }
    },
    {
      title: "pending-actions.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      fieldName: 'amount',
      controlOptions: {
        currency: 'currency'
      }
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityDetails",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityDetails",
      controlOptions: { completed: "payments.userApproval.completed" }
    }
  ];
}

export function getBatchValidateSelected(response: any): any {

  const finalData: any = {
    notAllowed: [],
    toAuthorize: [],
    toProcess: [],
  };
  const totalBatch: any[] = []

  if (response['internationalAuthorizationPermission']) {
    totalBatch.push(buildBatchList(response['internationalAuthorizationPermission']));
  }
  if (response['localAuthorizationPermission']) {
    totalBatch.push(buildBatchList(response['localAuthorizationPermission']));
  }
  if (response['ownAuthorizationPermission']) {
    totalBatch.push(buildBatchList(response['ownAuthorizationPermission']));
  }
  if (response['withinAuthorizationPermission']) {
    totalBatch.push(buildBatchList(response['withinAuthorizationPermission']));
  }

  totalBatch.forEach((element: any, index) => {
    if (element['notAllowed'] && element['notAllowed'].length > 0) {
      finalData['notAllowed'].push(...element['notAllowed'])
    }
    if (element['toAuthorize'] && element['toAuthorize'].length > 0) {
      finalData['toAuthorize'].push(...element['toAuthorize'])
    }
    if (element['toProcess'] && element['toProcess'].length > 0) {
      finalData['toProcess'].push(...element['toProcess'])
    }
  });

  return finalData;
}

export function buildBatchList(specificResponse: any): any {
  const batch = reviewBatchObject(specificResponse)
  return batch;
}

export function reviewBatchObject(object: any): any | null {
  const batchFormat: any = {
    notAllowed: [],
    toAuthorize: [],
    toProcess: [],
  };

  if (object['notAllowed'].length > 0) {
    object['notAllowed'].forEach((element: any) => {
      batchFormat.notAllowed.push(element)
    });
  }
  if (object['toProcess'].length > 0) {
    object['toProcess'].forEach((element: any) => {
      batchFormat.toProcess.push(element)
    });
  }
  if (object['toAuthorize'].length > 0) {
    object['toAuthorize'].forEach((element: any) => {
      batchFormat.toAuthorize.push(element)
    });
  }
  return batchFormat
}

export function getExtraFields(selectedData: any, response: any) {
  let listResponse: any[] = []
  listResponse.push(...isEmptyList(response['notAllowed']));
  listResponse.push(...isEmptyList(response['toProcess']));
  listResponse.push(...isEmptyList(response['toAuthorize']));

  selectedData.forEach((pendingSelected: any) => {
    listResponse.forEach((validateResponse: any) => {
      if (pendingSelected.batchPk === validateResponse.batchPk) {
        validateResponse['fullAccountNumber'] = pendingSelected['fullAccountNumber'];
        validateResponse['beneficiaryName'] = pendingSelected['beneficiaryName'];
        validateResponse['alias'] = pendingSelected['alias'];
        validateResponse['beneficiaryAccount'] = pendingSelected['beneficiaryAccount'];
        validateResponse['bankName'] = pendingSelected['bankName'];
        validateResponse['debitAmount'] = pendingSelected['debitAmount'];
        validateResponse['batchType'] = pendingSelected['batchType'];
        validateResponse['country'] = pendingSelected['country'];
        validateResponse['securityDetails'] = validateResponse['futureSecurityLevelsDTOList'] 
      }
    })
  })
}


export function isEmptyList(responseList: []): [] {
  return responseList && responseList.length > 0 ? responseList : [];
}


export function getSubtitle(item: any, data: any) {
  let subtitle = '';
  subtitle = item.mapObject ? item.mapObject[data[item.fieldName]] : data[item.fieldName];
  if (!subtitle) {
    subtitle = item.mapObject ? item.mapObject[data[item.subFieldname]] : data[item.subFieldname];
  }
  return subtitle;
}

export function createSummaryItemAmount(data: any): SummarySectionModel {
  let amountHeader: SummarySectionModel = {
    items: []
  }
  amountHeader.title = {
    id: "",
    title: '',
    amount: "",
    subTitle: []
  };

  if (data.toProcess.length > 0) {
    amountHeader.items!.push({
      title: 'pending-actions.total-transfer-fees',
      subTitle: data['total']['totalFeeProcess'].toString(),
      currency: '608'
    });
    calcTotal(data.toProcess, amountHeader, 'pending-actions.total-to-approve');
  }
  if (data.toAuthorize.length) {
    amountHeader.items!.push({
      title: 'pending-actions.total-transfer-authorize-fees',
      subTitle: data['total']['totalFeeAuthorize'].toString(),
      currency: '608'
    });
    calcTotal(data.toAuthorize, amountHeader, 'pending-actions.total-to-authorize');
  }
  if (data.notAllowed.length > 0) {
    amountHeader.items!.push({
      title: 'pending-actions.total-transfer-notAllowed-fees',
      subTitle: data['total']['totalFeeNotAllowed'].toString(),
      currency: '608'
    });
    calcTotal(data.notAllowed, amountHeader, 'pending-actions.total-to-notAllowed');
  }

  return amountHeader;
}


export function calcTotal(items: Batch[], amountHeader: SummarySectionModel, title: string) {
  let totalAmount: any = {}
  items.forEach(item => {
    totalAmount[item.currency || '608'] = (totalAmount[item.currency || "608"] || 0) + item.amount;
  });

  Object.keys(totalAmount).forEach(key => {
    amountHeader.items!.push({
      title: title,
      subTitle: totalAmount[key],
      currency: key
    });
  });

}
