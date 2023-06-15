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
import { ResponseException } from "app/@core/service/base/responseException";
import { ModelAndListService } from "app/@core/service/base/modelAndList.service";

export class CardsPendingActionsPage implements PendingActionPage {

  constructor(private pendingActionsService: PendingActionsService, private datePipe: DatePipe, private counters: { [key: string]: number }, private modelAndListService: ModelAndListService) {
  }

  title = "pending-actions.cards";
  workflowType: WorkflowType[] = [{
    type: 'PS',
    isFinancial: true
  },
  {
    type: 'PB',
    isFinancial: true
  }];
  tabs: TabModel[] = buildTabs(this.counters);
  workflowTabs: TabModel[] = buildTabs();
  pendingActions: PendingActionModel[] = buildPendingAction(this.pendingActionsService, this.datePipe, this.counters, this.modelAndListService);
}

export function buildPendingAction(pendingActionsService: PendingActionsService, datePipe: DatePipe, counters: any, modelAndListService: ModelAndListService): PendingActionModel[] {
  let pendingActions: PendingActionModel[] = [];
  if (counters) {
    if (counters.hasOwnProperty('prepaidCards'))
      pendingActions.push(new PrepaidPendingAction(pendingActionsService, datePipe, modelAndListService))
    if (counters.hasOwnProperty('businessCards'))
      pendingActions.push(new BusinessCardsPendingAction(pendingActionsService, datePipe))
  }
  return pendingActions;
}

export function buildTabs(counters?: any): TabModel[] {
  let tabs: TabModel[] = [];
  let tabCount: number = 0;
  if (counters) {
    if (counters.hasOwnProperty('prepaidCards')) {
      tabs.push({ text: "pending-actions.prePaid-cards-payment", value: tabCount.toString() })
      tabCount++
    }
    if (counters.hasOwnProperty('businessCards')) {
      tabs.push({ text: "pending-actions.business-cards", value: tabCount.toString() })
      tabCount++
    }
  }
  else {
    tabs.push(
      {
        text: "pending-actions.prePaid-cards-payment",
        value: "0",
      },
      {
        text: "pending-actions.business-cards",
        value: "1",
      });
  }
  return tabs;
}
export class PrepaidPendingAction extends PendingActionModel {
  mapObject = { "PR": "Refund", "LD": "Load Fund" };
  override serviceMapObjects = ["errors"];


  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe, private modelAndListService: ModelAndListService) {
    super(_datePipe);
  }


  override successApproveMessage = "pending-actions.selected-cards-approved";
  override successRejectMessage = "pending-actions.selected-cards-rejected";


  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("prepaidCards/pending/list", data).subscribe(res => {
        observer.next(res.prepaidCardsPagedResults);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("prepaidCards/pending/validate", { batchList: data }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("prepaidCards/pending/confirm", {
        batchList: data,
        requestValidate
      }).subscribe({
        next: (res) => {
          let success: any[] = [];
          let error: any[] = [];
          if (res.resultList.length > 0) {
            res.resultList.forEach((CardsSelected: any) => {
              if (CardsSelected.returnCode === '000')
                success.push(CardsSelected)
              else
                error.push(CardsSelected)
            });
          }
          res['warningResult'] = [];
          res['warningResult']['success'] = success;
          res['warningResult']['error'] = error;
          res['warningResult']['errorList'] = this.getErrors()
          observer.next(res);
        },
        error: (error: ResponseException) => {
        }
      });
    });
  }


  rejectPendingActions(data: any, rejectReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("prepaidCards/pending/refuse", {
        batchList: data,
        rejectReason
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
    { title: "pending-actions.card-number", type: TableHeaderType.TEXT, fieldName: 'cardNumber' },
    {
      title: "pending-actions.operation-type",
      type: TableHeaderType.TEXT,
      fieldName: 'typeOperation',
      mapObject: this.mapObject
    },
    {
      title: "pending-actions.account-number",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber',
    },
    {
      title: "pending-actions.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: { currency: "currency"   /*Account Currency*/ },
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
    }];


  override TableHeaderModelWarning: TableHeaderModel[] = [
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate'
    },
    { title: "pending-actions.card-number", type: TableHeaderType.TEXT, fieldName: 'cardNumber' },
    {
      title: "pending-actions.operation-type",
      type: TableHeaderType.TEXT,
      fieldName: 'typeOperation',
      mapObject: this.mapObject
    },
    {
      title: "pending-actions.account-number",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber',
    },
    {
      title: "pending-actions.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: { currency: "currency"   /*Account Currency*/ },
      fieldName: 'amount'
    },
    {
      title: "pending-actions.operation-status",
      type: TableHeaderType.TEXT,
      fieldName: 'returnCodeMapped',
    }
  ];

  getErrors():[] {
    let errorList: [] = [];
    this.modelAndListService.getList(['errors']).subscribe(models => {
      errorList = models['errors']
    });
    return errorList
  }
}

export class BusinessCardsPendingAction extends PendingActionModel {
  override serviceMapObjects = ["errors"];
  mapObject = { "0": "Due Amount", "1": "Outstanding Amount", "2": "Custom" };

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-cards-approved";
  override successRejectMessage = "pending-actions.selected-cards-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("businessCards/pendingActions/list", data).subscribe(res => {
        observer.next(res.businessCardPaymentsPagedResults);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("businessCards/pendingActions/validate", { batchList: data }).subscribe(res => {
        observer.next({
          batchList: res.batchList,
          generateChallengeAndOTP: res.generateChallengeAndOTP
        });
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("businessCards/pendingActions/confirm", {
        batchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("businessCards/pendingActions/refuse", {
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
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate'
    },
    { title: "pending-actions.card-number", type: TableHeaderType.TEXT, fieldName: 'cardAccountNumber' },
    {
      title: "pending-actions.operation-type",
      type: TableHeaderType.TEXT,
      fieldName: 'paymentOption',
      mapObject: this.mapObject
    },
    {
      title: "pending-actions.account-number",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber',
    },
    {
      title: "pending-actions.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: { currency: "currency"   /*Account Currency*/ },
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
    }];
}


