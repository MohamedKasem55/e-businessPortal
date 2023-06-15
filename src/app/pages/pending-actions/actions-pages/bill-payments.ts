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
import { SummarySectionModel } from "arb-design-library/model/summary-section.model";
import { Batch, BatchList } from "app/@core/model/rest/common/batchResponse";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { AddBillService } from "app/@core/service/payments/add-bill/add-bill.service";

export class BillPaymentsPendingActionsPage implements PendingActionPage {

  constructor(private pendingActionsService: PendingActionsService, private datePipe: DatePipe, private counters: {[key: string]: number},private addBillService: AddBillService) {
  }

  title = "pending-actions.bill-payments";
  workflowType: WorkflowType[] = [{
    type: 'BI',
    isFinancial: true
  }, {
    type: 'BA',
    isFinancial: false
  }];
  tabs: TabModel[] = buildTabs(this.counters);
  workflowTabs: TabModel[] = buildTabs();
  pendingActions: PendingActionModel[] = buildPendingAction(this.pendingActionsService, this.datePipe, this.counters,this.addBillService);
}


export function buildPendingAction(pendingActionsService: PendingActionsService, datePipe: DatePipe, counters: any,addBillService: AddBillService): PendingActionModel[] {
  let pendingActions: PendingActionModel[] = [];
  if (counters) {
    if (counters.hasOwnProperty('billPay'))
      pendingActions.push(new BillPaymentsPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('billPayAdd'))
      pendingActions.push(new AddBillPendingAction(pendingActionsService, datePipe,addBillService))
  }
  return pendingActions;
}


export function buildTabs(counters?: any): TabModel[] {
  let tabs: TabModel[] = [];
  let tabCount: number = 0;
  if (counters) {
    if (counters.hasOwnProperty('billPay')) {
      tabs.push({text: "pending-actions.pending-bill-payments", value: tabCount.toString()})
      tabCount++
    }
    if (counters.hasOwnProperty('billPayAdd')) {
      tabs.push({text: "pending-actions.pending-bills", value: tabCount.toString()})
      tabCount++
    }
  } else {
    tabs.push(
      {
        text: "pending-actions.pending-bill-payments",
        value: "0",
      },
      {
        text: "pending-actions.pending-bills",
        value: "1",
      });
  }
  return tabs;
}


export class BillPaymentsPendingAction extends PendingActionModel {
  override serviceMapObjects = ["currency"];

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }


  override successApproveMessage = "pending-actions.selected-bill-payments-approved";
  override successRejectMessage = "pending-actions.selected-bill-payments-rejected";


  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("billPayment/pendingActions/billPayment/list", data).subscribe(res => {
        observer.next(res.billsPagedResults);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("billPayment/pendingActions/billPayment/validate", {batchList: data}).subscribe(res => {
        res['batchList']['total'] = res['total'];
        res['batchList']['requiredSFA'] = res['requiredSFA'];
        observer.next(res);
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("billPayment/pendingActions/billPayment/confirm", {
        batchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("billPayment/pendingActions/billPayment/refuse", {
        batchList: data,
        rejectionReason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: {format: 'dd/MM/yyyy'},
      fieldName: 'initiationDate'
    },
    {title: "pending-actions.from-account", type: TableHeaderType.TEXT, fieldName: 'accountNumber'},
    {
      title: "pending-actions.biller-name",
      type: TableHeaderType.TEXT,
      fieldName: this.translate.currentLang == 'en' ? 'addDescriptionEn' : 'addDescriptionAr'
    },
    {title: "pending-actions.bill-reference", type: TableHeaderType.TEXT, fieldName: 'billRef'},
    {title: "pending-actions.nickname", type: TableHeaderType.TEXT, fieldName: 'nickname'},
    {
      title: "pending-actions.bill-amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {currency: "currency"   /*Account Currency*/},
      fieldName: 'amount'
    },
    {
      title: "pending-actions.paid-amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {currency: "currency"   /*Account Currency*/},
      fieldName: 'amountPayment'
    },
    {
      title: "pending-actions.vat-amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {currency: "currency"   /*Account Currency*/},
      fieldName: 'vatAmount'
    },
    {
      title: "pending-actions.amount-without-vat",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {currency: "currency"   /*Account Currency*/},
      fieldName: 'amountWithoutVat'
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
      controlOptions: {completed: "payments.userApproval.completed"}
    }];

  override buildSummaryPage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    let summary: SummaryModel = super.buildSummaryPage(title, isApprove, data, headers);
    if (isApprove && data && data['total']) {
      summary.sections!.unshift(this.createSummaryItemAmount(data));
    }
    return summary
  }

  createSummaryItemAmount(data: any): SummarySectionModel {
    let amountHeader: SummarySectionModel = {
      items: []
    }
    amountHeader.title = {
      id: "",
      title: '',
      amount: ""
    };

    amountHeader.items?.push({
      title: 'pending-actions.total-fees',
      subTitle: data['toProcess'].length > 0 ? data['total']['totalVatAmountToProcess'] : data['total']['totalVatAmountToAuthorize'],
      // currency: item.controlOptions?.currency ?  item.controlOptions?.currency :''
    });
    amountHeader.items?.push({
      title: 'pending-actions.total-amount',
      subTitle: data['toProcess'].length > 0 ? data['total']['totalAmountToProcess'] : data['total']['totalAmountToAuthorize'],
      // currency: item.controlOptions?.currency ?  item.controlOptions?.currency :''
    });
    return amountHeader;
  }

  override buildTablePage(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    title = this.translate.instant(title) + " " + (isApprove ? this.translate.instant('pending-actions.approval') : this.translate.instant('pending-actions.rejection'));
    let summarySubTitle = "Summary";

    if (isApprove) {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: []
      }
      if (data.toProcess.length > 0) {
        summary.sections?.push({
          title: {id: "", title: 'pending-actions.actions-will-be-complete'},
          table: this.getSummaryTable(data.toProcess, headers),
        });
      }
      if (data.toAuthorize?.length) {
        summary.sections?.push({
          title: {id: "", title: 'pending-actions.actions-will-approved'},
          table: this.getSummaryTable(data.toAuthorize, headers),
        });
      }
      if (data.notAllowed.length > 0) {
        summary.sections?.push({
          title: {id: "", title: 'pending-actions.actions-not-allowed'},
          table: this.getSummaryTable(data.notAllowed, headers),
        });
      }

      if (isApprove && data && data['total']) {
        summary.sections!.unshift(this.createSummaryItemAmount(data));
      }

      return summary;
    } else {
      let summary: SummaryModel = {
        title: this.getSummaryTitle(title, summarySubTitle),
        sections: [
          {
            title: {id: "", title: 'pending-actions.rejected'},
            table: this.getSummaryTable(data.toReject, headers),
          }]
      }
      if (isApprove && data && data['total']) {
        summary.sections!.unshift(this.createSummaryItemAmount(data));
      }
      return summary;
    }
  }

}

export class AddBillPendingAction extends PendingActionModel {
  billCodeList:any[]=[]
  billObject:any={}

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe,private addBillService: AddBillService) {
    super(_datePipe);
    this.addBillService.getProvidersDetails(false).subscribe((data) => {
      this.billCodeList = data.billCodesList.billsList.map((element) => {
        return {
          key: element.billCode,
          value: this.translate.currentLang==='ar'?element.addDescriptionAr:element.addDescriptionEn,
        };
      });
      this.billObject=this.billCodeList.reduce((acc, obj) => {
        acc[obj.key] = obj.value;
        return acc;
      }, {});
    })
  }

  override successApproveMessage = "pending-actions.selected-add-bill-approved";
  override successRejectMessage = "pending-actions.selected-add-bill-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("billPayment/pendingActions/billAdd/list", data).subscribe(res => {
        this.addBillCodeMapped(res.billsPagedResults.items)
        observer.next(res.billsPagedResults);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("billPayment/pendingActions/billAdd/validate", {batchList: data}).subscribe(res => {
       this.addBillCodeMapped(res.batchList.toProcess)
       this.addBillCodeMapped(res.batchList.toAuthorize)
       this.addBillCodeMapped(res.batchList.notAllowed)
        observer.next({
          batchList: res.batchList,
          generateChallengeAndOTP: res.generateChallengeAndOTP,
          requiredSFA: res['requiredSFA']
        });
      });
    });
  }

  addBillCodeMapped(batchList:any){
    batchList?.forEach((batch:any) => {
      batch.billCodeMapped=this.billObject[batch.billCode]
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("billPayment/pendingActions/billAdd/confirm", {
        batchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("billPayment/pendingActions/billAdd/refuse", {
        batchList: data,
        rejectionReason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.unity-service-provider",
      type: TableHeaderType.TEXT,
      fieldName: 'billCodeMapped',
    },
    {title: "pending-actions.subscriber-number", type: TableHeaderType.TEXT, fieldName: 'billRef'},
    {title: "pending-actions.nickname", type: TableHeaderType.TEXT, fieldName: 'nickname'},
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
      controlOptions: {completed: "payments.userApproval.completed"}
    }];
}
