import {
  PendingActionModel,
  PendingActionPage,
  PendingActionPagination, ValidatePendingActionsResponse, WorkflowType
} from "../../../@core/model/dto/pending-actions-model";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { SummarySectionModel } from "arb-design-library/model/summary-section.model";
import { BatchList, Batch } from "app/@core/model/rest/common/batchResponse";
import { PendingActionsService } from "../../../@core/service/pending-actions/pending-actions-service";
import { DatePipe } from "@angular/common";
import { TabModel } from "arb-design-library/model/tab.model";
import { Observable, Subscriber } from "rxjs";
import { RequestValidate } from "../../../@core/model/rest/common/otp.model";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";
import { TableHeaderType } from "arb-design-library";
import { getCurrentLevelControlOptions } from "./current-level-control-options";
import { Utils } from "../../../@core/utility/Utils";

export class MoiPendingActionsPage implements PendingActionPage {

  constructor(private pendingActionsService: PendingActionsService, public datePipe: DatePipe, private counters: { [key: string]: number }) {
  }

  title = "pending-actions.eGovSadadPayments";
  workflowType: WorkflowType[] = [{
    type: 'GR',
    isFinancial: true
  },
  {
    type: 'GS',
    isFinancial: true
  }];

  tabs: TabModel[] = buildTabs(this.counters);
  workflowTabs: TabModel[] = buildTabs();
  pendingActions: PendingActionModel[] = buildPendingAction(this.pendingActionsService, this.datePipe, this.counters);
}


export function buildPendingAction(pendingActionsService: PendingActionsService, datePipe: DatePipe, counters: any): PendingActionModel[] {
  let pendingActions: PendingActionModel[] = [];
  if (counters) {
    if (counters.hasOwnProperty('eGovSadadPayments'))
      pendingActions.push(new MoiPaymentsPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('eGovSadadRefund'))
      pendingActions.push(new MoiRefundPendingAction(pendingActionsService, datePipe))
  }
  return pendingActions;
}

export function buildTabs(counters?: any): TabModel[] {
  let tabs: TabModel[] = [];
  let tabCount: number = 0;
  if (counters) {
    if (counters.hasOwnProperty('eGovSadadPayments')) {
      tabs.push({ text: "pending-actions.moi-payments", value: tabCount.toString() })
      tabCount++
    }
    if (counters.hasOwnProperty('eGovSadadRefund')) {
      tabs.push({ text: "pending-actions.moi-refunds", value: tabCount.toString() })
      tabCount++
    }
  }
  else {
    tabs.push(
      {
        text: "pending-actions.moi-payments",
        value: "0",
      },
      {
        text: "pending-actions.moi-refunds",
        value: "1",
      });
  }
  return tabs;
}

export class MoiPaymentsPendingAction extends PendingActionModel {
  sharedData: any = {}
  paymentsTotalAmountToProcess: number = 0;
  paymentsTotalAmountToAuthorize: number = 0;
  paymentsTotalAmount: number = 0;

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-moi-payments-approved";
  override successRejectMessage = "pending-actions.selected-moi-payments-rejected";
  override serviceMapObjects = ["eGovApplicationTypeAll", "currencyIso", "currency"];

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("moiPayment/pendingActions/payment/list", data).subscribe(res => {
        this.getStatusChange(res.pendingItems);
        observer.next(res.pendingItems);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("moiPayment/pendingActions/validate",
        {
          listSelectedBatchSP: data,
          listSelectedBatchSR: [],
          actionType: "A",
        }).subscribe(res => {

          this.getOldFunctionality(res['checkAndSeparateAuthorizationPermissionSP']);

          observer.next({
            batchList: res.checkAndSeparateAuthorizationPermissionSP,
            generateChallengeAndOTP: res.generateChallengeAndOTP
          });
        });
    });
  }


  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("moiPayment/pendingActions/confirm", {
        checkAndSeparateAuthorizationPermissionSP: data,
        checkAndSeparateAuthorizationPermissionSR: null,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, reason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("moiPayment/pendingActions/refuse", {
        lBatchSP: data,
        lBatchSR: [],
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
      fieldName: 'initiationDate'
    },
    {
      title: "pending-actions.service-type",
      type: TableHeaderType.TEXT,
      fieldName: 'applicationType',
      mapObject: 'eGovApplicationTypeAll'
    },
    { title: "pending-actions.beneficiary-name", type: TableHeaderType.TEXT, fieldName: 'beneficiaryName' },
    { title: "pending-actions.account", type: TableHeaderType.TEXT, fieldName: 'accountNumber' },
    {
      title: "pending-actions.unused-balance",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: { currency: "currency" },
      fieldName: 'unusedBalance'
    },
    {
      title: "pending-actions.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: { currency: "currency" },
      fieldName: 'amount'
    },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: { completed: "payments.userApproval.completed" }
    }
  ];


  override buildSummaryPage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    title = title;
    let summarySubTitle = "Summary";

    let summary: SummaryModel = {
      title: this.getSummaryTitle(title, summarySubTitle),
    }
    let summarySections: SummarySectionModel[] = [];

    let counter = 0;

    if (data && data.toProcess) {
      data.toProcess.forEach((item: Batch, index: number) => {
        counter = counter + 1;
        isApprove ? summarySections.push(this.createSummaryItem('Positive', 'pending-actions.actions-will-be-complete', counter, item, headers)) : summarySections.push(this.createSummaryItem('Neutral', "pending-actions.actions-will-be-reject", index + 1, item, headers));
      });
    }
    if (data && data.toAuthorize) {
      data.toAuthorize.forEach((item: Batch, index: number) => {
        counter = counter + 1;
        isApprove ? summarySections.push(this.createSummaryItem('Neutral', 'pending-actions.actions-will-approved', counter, item, headers)) : summarySections.push(this.createSummaryItem('Neutral', "pending-actions.actions-will-be-reject", index + 1, item, headers));
      });
    }
    if (data && data.notAllowed) {
      data.notAllowed.forEach((item: Batch, index: number) => {
        counter = counter + 1;
        isApprove ? summarySections.push(this.createSummaryItem('Negative', 'pending-actions.actions-not-allowed', counter, item, headers)) : summarySections.push(this.createSummaryItem('Neutral', "pending-actions.actions-will-be-reject", index + 1, item, headers));
      });
    }
    if (data && data.toReject) {
      data.toReject.forEach((item: Batch, index: number) => {
        summarySections.push(this.createSummaryItem('Neutral', "pending-actions.actions-will-be-reject", index + 1, item, headers));
      })
    }

    summary.sections = summarySections;
    return summary;
  }

  calculatePaymentsTotalAmount() {
    this.paymentsTotalAmount = 0

    if (
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP &&
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP[
      'toProcess'
      ]
    ) {
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP[
        'toProcess'
      ].forEach((batch: { amount: string; }) => {
        this.paymentsTotalAmountToProcess += parseFloat(batch.amount)
        this.paymentsTotalAmount += parseFloat(batch.amount)
      })
    }

    if (
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP &&
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP[
      'toAuthorize'
      ]
    ) {
      this.sharedData.showBatchList.checkAndSeparateAuthorizationPermissionSP[
        'toAuthorize'
      ].forEach((batch: { amount: string; }) => {
        this.paymentsTotalAmountToAuthorize += parseFloat(batch.amount)
        this.paymentsTotalAmount += parseFloat(batch.amount)
      })
    }
  }

  getStatusChange(res: any) {
    res.items.forEach((item: any) => {
      let levels = Utils.getLevels(item.securityLevelsDTOList, this.translate);
      item['statusExport'] = levels.status;
      item['nextStatusExport'] = levels.nextStatus;
      item['_initiation'] = this._datePipe.transform(new Date(item['initiationDate']), 'dd/MM/yyyy hh:mm');
    });
  }

  getOldFunctionality(result: any) {

    this.sharedData['showBatchList'] = result
    this.calculatePaymentsTotalAmount()
    if (
      this.sharedData.showBatchList
        .checkAndSeparateAuthorizationPermissionSP
    ) {
      this.processItemsLevels(
        this.sharedData.showBatchList
          .checkAndSeparateAuthorizationPermissionSP['toProcess'],
      )
      this.processItemsLevels(
        this.sharedData.showBatchList
          .checkAndSeparateAuthorizationPermissionSP['toAuthorize'],
      )
      this.sharedData.paymentsSelected.forEach((paymentSelected: { [x: string]: any; }) => {
        let batch = this.findBatch(
          paymentSelected['batchPk'],
          result.checkAndSeparateAuthorizationPermissionSP['toProcess'],
        )
        if (!batch) {
          batch = this.findBatch(
            paymentSelected['batchPk'],
            result.checkAndSeparateAuthorizationPermissionSP[
            'toAuthorize'
            ],
          )
        }
        paymentSelected['citizenId'] =
          this.getCitizenIdFromDetails(
            batch.details ? batch.details : [],
          )
      })
    }
    if (
      this.sharedData.showBatchList
        .checkAndSeparateAuthorizationPermissionSR
    ) {
      this.processItemsLevels(
        this.sharedData.showBatchList
          .checkAndSeparateAuthorizationPermissionSR['toProcess'],
      )
      this.processItemsLevels(
        this.sharedData.showBatchList
          .checkAndSeparateAuthorizationPermissionSR['toAuthorize'],
      )
      this.sharedData.refundsSelected.forEach((refundsSelected: { [x: string]: any; }) => {
        let batch = this.findBatch(
          refundsSelected['batchPk'],
          result.checkAndSeparateAuthorizationPermissionSR['toProcess'],
        )
        if (!batch) {
          batch = this.findBatch(
            refundsSelected['batchPk'],
            result.checkAndSeparateAuthorizationPermissionSR[
            'toAuthorize'
            ],
          )
        }
        refundsSelected['citizenId'] =
          this.getCitizenIdFromDetails(
            batch.details ? batch.details : [],
          )
      })
    }
  }

  private findBatch(batchPk: number, batchesArray: any[]) {
    const batch = batchesArray.find(
      (batchElem) => batchElem['batchPk'] === batchPk,
    )
    return batch
  }

  public getCitizenIdFromDetails(details: any[]) {
    return details && details[0] ? details[0].value : null
  }

  protected processItemsLevels(items: any[]) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        if (
          this.sharedData.approveFlow &&
          typeof item.securityLevelsDTOList != 'undefined' &&
          item.securityLevelsDTOList != null
        ) {
          let levels = Utils.getLevels(item.securityLevelsDTOList, this.translate);
          item['statusExport'] = levels.status;
          item['nextStatusExport'] = levels.nextStatus;
        } else {
          let levels = Utils.getLevels(item.futureSecurityLevelsDTOList, this.translate);
          item['statusExport'] = levels.status;
          item['nextStatusExport'] = levels.nextStatus;
        }
      })
    }
  }

}

export class MoiRefundPendingAction extends PendingActionModel {

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }


  override successApproveMessage = "pending-actions.selected-moi-refunds-approved";
  override successRejectMessage = "pending-actions.selected-moi-refunds-rejected";
  override serviceMapObjects = ["eGovApplicationTypeAll", "currencyIso", "currency"];

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("moiPayment/pendingActions/refund/list", data).subscribe(res => {
        observer.next(res.pendingItems);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("moiPayment/pendingActions/validate", {
        listSelectedBatchSP: [],
        listSelectedBatchSR: data,
        actionType: "A",
      }).subscribe(res => {
        observer.next({
          batchList: res.checkAndSeparateAuthorizationPermissionSR,
          generateChallengeAndOTP: res.generateChallengeAndOTP
        });
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("moiPayment/pendingActions/confirm", {
        checkAndSeparateAuthorizationPermissionSP: null,
        checkAndSeparateAuthorizationPermissionSR: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, reason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("moiPayment/pendingActions/refuse", {
        lBatchSP: [],
        lBatchSR: data,
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
      fieldName: 'initiationDate'
    },
    {
      title: "pending-actions.service-type",
      type: TableHeaderType.TEXT,
      fieldName: 'applicationType',
      mapObject: 'eGovApplicationTypeAll'
    },
    { title: "pending-actions.beneficiary-name", type: TableHeaderType.TEXT, fieldName: 'beneficiaryName' },
    { title: "pending-actions.account", type: TableHeaderType.TEXT, fieldName: 'accountNumber' },
    {
      title: "pending-actions.current-level",
      type: TableHeaderType.CURRENT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: getCurrentLevelControlOptions
    },
    {
      title: "pending-actions.next-level",
      type: TableHeaderType.NEXT_LEVEL,
      fieldName: "securityLevelsDTOList",
      controlOptions: { completed: "payments.userApproval.completed" }
    }
  ];

  override buildSummaryPage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    title = title;
    let summarySubTitle = "Summary";

    let summary: SummaryModel = {
      title: this.getSummaryTitle(title, summarySubTitle),
    }
    let summarySections: SummarySectionModel[] = [];

    let counter = 0;

    if (data && data.toProcess) {
      data.toProcess.forEach((item: Batch, index: number) => {
        counter = counter + 1;
        isApprove ? summarySections.push(this.createSummaryItem('Positive', 'pending-actions.actions-will-be-complete', counter, item, headers)) : summarySections.push(this.createSummaryItem('Neutral', "pending-actions.actions-will-be-reject", index + 1, item, headers));
      });
    }
    if (data && data.toAuthorize) {
      data.toAuthorize.forEach((item: Batch, index: number) => {
        counter = counter + 1;
        isApprove ? summarySections.push(this.createSummaryItem('Neutral', 'pending-actions.actions-will-approved', counter, item, headers)) : summarySections.push(this.createSummaryItem('Neutral', "pending-actions.actions-will-be-reject", index + 1, item, headers));
      });
    }
    if (data && data.notAllowed) {
      data.notAllowed.forEach((item: Batch, index: number) => {
        counter = counter + 1;
        isApprove ? summarySections.push(this.createSummaryItem('Negative', 'pending-actions.actions-not-allowed', counter, item, headers)) : summarySections.push(this.createSummaryItem('Neutral', "pending-actions.actions-will-be-reject", index + 1, item, headers));
      });
    }
    if (data && data.toReject) {
      data.toReject.forEach((item: Batch, index: number) => {
        summarySections.push(this.createSummaryItem('Neutral', "pending-actions.actions-will-be-reject", index + 1, item, headers));
      })
    }

    summary.sections = summarySections;
    return summary;
  }

}

