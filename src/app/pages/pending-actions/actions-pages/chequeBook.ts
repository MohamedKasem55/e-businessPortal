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

export class ChequeBookPendingActionsPage implements PendingActionPage {
  constructor(private pendingActionsService: PendingActionsService, private datePipe: DatePipe, private counters: {[key: string]: number}) {
  }
  title = "pending-actions.chequebook-management";
  workflowType: WorkflowType[] = [{
    type: 'CC',
    isFinancial: false
  },
  {
    type: 'CS',
    isFinancial: false
  },
  {
    type: 'CP',
    isFinancial: false
  }
  ];
  tabs: TabModel[] = buildTabs(this.counters);
  workflowTabs: TabModel[] = buildTabs();
  pendingActions: PendingActionModel[] = buildPendingAction(this.pendingActionsService, this.datePipe, this.counters);
}

export function buildPendingAction(pendingActionsService: PendingActionsService, datePipe: DatePipe, counters: any): PendingActionModel[] {
  let pendingActions: PendingActionModel[] = [];
  if (counters) {
    if (counters.hasOwnProperty('requestCheckBook'))
      pendingActions.push(new ChequeBookPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('stopCheckBookGrou') !== 0)
      pendingActions.push(new StopChequeBookPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('positivePayCheck') == 0)
      pendingActions.push(new PositivePayPendingAction(pendingActionsService, datePipe))
  }
  return pendingActions;
}

export function buildTabs(counters?: any): TabModel[] {
  let tabs: TabModel[] = [];
  let tabCount: number = 0;
  if (counters) {
    if (counters.hasOwnProperty('requestCheckBook')) {
      tabs.push({ text: "pending-actions.pending-chequebook", value: tabCount.toString(), },)
      tabCount++
    }
    if (counters.hasOwnProperty('stopCheckBookGrou') !== 0) {
      tabs.push({ text: "pending-actions.pending-stop-chequebook", value: tabCount.toString(), },)
      tabCount++
    }
    if (counters.hasOwnProperty('positivePayCheck') == 0) {
      tabs.push({ text: "pending-actions.pending-positive-pay", value: tabCount.toString() })
      tabCount++
    }
  }
  else {
    tabs.push(
      {
        text: "pending-actions.pending-chequebook",
        value: "0",
      },
      {
        text: "pending-actions.pending-stop-chequebook",
        value: "1",
      },
      {
        text: "pending-actions.pending-positive-pay",
        value: "2",
      });
  }
  return tabs;
}


export class ChequeBookPendingAction extends PendingActionModel {
  mapObject = { "2": "25 pages", "3": "50 Pages" };

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }


  override successApproveMessage = "pending-actions.selected-chequebook-approved";
  override successRejectMessage = "pending-actions.selected-chequebook-rejected";


  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("chequeBook/pendingActions/create/list", data).subscribe(res => {
        observer.next(res.batchList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("chequeBook/pendingActions/create/validate", { batchList: data }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("chequeBook/pendingActions/create/confirm", {
        batchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("chequeBook/pendingActions/stop/refuse", {
        batchList: data,
        rejectionReason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.account",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber'
    },
    {
      title: "pending-actions.chequebook-Type",
      type: TableHeaderType.TEXT,
      fieldName: 'typeCheck',
      mapObject: this.mapObject
    },
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate'
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

export class StopChequeBookPendingAction extends PendingActionModel {

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-stop-chequebook-approved";
  override successRejectMessage = "pending-actions.selected-stop-chequebook-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("chequeBook/pendingActions/stop/list", data).subscribe(res => {
        observer.next(res.batchList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("chequeBook/pendingActions/stop/validate", { batchList: data }).subscribe(res => {
        observer.next({
          batchList: res.batchList,
          generateChallengeAndOTP: res.generateChallengeAndOTP
        });
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("chequeBook/pendingActions/stop/confirm", {
        batchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("chequeBook/pendingActions/stop/refuse", {
        batchList: data,
        rejectionReason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.account",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber'
    },
    {
      title: "pending-actions.chequebook-Type",
      type: TableHeaderType.TEXT,
      fieldName: 'checkNumber'
    },
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate'
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

export class PositivePayPendingAction extends PendingActionModel {

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-positive-pay-approved";
  override successRejectMessage = "pending-actions.selected-positive-pay-rejected";

  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("positivePayCheck/pendingActions/list", data).subscribe(res => {
        observer.next(res.batchList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("positivePayCheck/pendingActions/validate", { batchList: data }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("positivePayCheck/pendingActions/confirm", {
        batchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("chequeBook/pendingActions/stop/refuse", {
        batchList: data,
        rejectionReason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.account",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber'
    },
    {
      title: "pending-actions.amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: { currency: "currency" },
      fieldName: 'amount'
    },
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate'
    },
    {
      title: "pending-actions.chequebook-number",
      type: TableHeaderType.TEXT,
      fieldName: 'checkNumber'
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
