import {
  PendingActionModel,
  PendingActionPage,
  ValidatePendingActionsResponse
} from "../../../@core/model/dto/pending-actions-model";
import { PendingActionsService } from "../../../@core/service/pending-actions/pending-actions-service";
import { DatePipe } from "@angular/common";
import { TabModel } from "arb-design-library/model/tab.model";
import { Observable, Subscriber } from "rxjs";
import { RequestValidate } from "../../../@core/model/rest/common/otp.model";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";
import { TableHeaderType } from "arb-design-library";
import { getCurrentLevelControlOptions } from "./current-level-control-options";
import { Batch } from "app/@core/model/rest/common/batchResponse";

export class PosPendingActionsPage implements PendingActionPage {
  constructor(private pendingActionsService: PendingActionsService, private datePipe: DatePipe, private counters: {[key: string]: number}) {
  }

  title = "pending-actions.pos";
  workflowType = [];
  tabs: TabModel[] = buildTabs(this.counters);
  workflowTabs: TabModel[] = buildTabs();
  pendingActions: PendingActionModel[] = buildPendingAction(this.pendingActionsService, this.datePipe, this.counters);
}

export function buildPendingAction(pendingActionsService: PendingActionsService, datePipe: DatePipe, counters: any): PendingActionModel[] {
  let pendingActions: PendingActionModel[] = [];
  if (counters) {
    if (counters.hasOwnProperty('posRequestCount'))
      pendingActions.push(new NewRequestPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('posManagementCount'))
      pendingActions.push(new PosManagementPendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('posMaintenanceCount'))
      pendingActions.push(new PosMaintenancePendingAction(pendingActionsService, datePipe))
    if (counters.hasOwnProperty('posClaimCount'))
      pendingActions.push(new ClaimsPendingAction(pendingActionsService, datePipe))
  }
  return pendingActions;
}

export function buildTabs(counters?: any): TabModel[] {
  let tabs: TabModel[] = [];
  let tabCount: number = 0;
  if (counters) {
    if (counters.hasOwnProperty('posRequestCount')) {
      tabs.push({ text: "pending-actions.new-request", value: tabCount.toString() })
      tabCount++
    }
    if (counters.hasOwnProperty('posManagementCount')) {
      tabs.push({ text: "pending-actions.pos-management", value: tabCount.toString() })
      tabCount++
    }
    if (counters.hasOwnProperty('posMaintenanceCount')) {
      tabs.push({ text: "pending-actions.pos-maintenance", value: tabCount.toString() })
      tabCount++
    }
    if (counters.hasOwnProperty('posClaimCount')) {
      tabs.push({ text: "pending-actions.claims", value: tabCount.toString() })
      tabCount++
    }
  }
  else {
    tabs.push(
      {
        text: "pending-actions.new-request",
        value: "0",
      },
      {
        text: "pending-actions.pos-management",
        value: "1",
      },
      {
        text: "pending-actions.pos-maintenance",
        value: "2",
      },
      {
        text: "pending-actions.claims",
        value: "3",
      });
  }
  return tabs;
}

export class NewRequestPendingAction extends PendingActionModel {
  mapObject = {
    "R001": "Request a POS Terminal",
    "R002": "Requesting Additional Terminals",
    "R003": "Request Enrollment in the e.commerce"
  };

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-point-of-sale-approved";
  override successRejectMessage = "pending-actions.selected-point-of-sale-rejected";

  getPendingActions(data: PendingActionPaginationPOS): Observable<any> {
    data['typeSearch'] = 'REQUEST';
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("posManagement/pendingActions/list", data).subscribe(res => {
        observer.next(res.posRequestBatchList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    let posObject: PendingActionValidation = initialPOS;
    posObject['posRequestBatchList'] = data;
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("posManagement/pendingActions/validate", posObject).subscribe(res => {
        observer.next({
          batchList: res.batchPosRequestList,
          generateChallengeAndOTP: res.generateChallengeAndOTP
        });
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    let posObjectBatch: PendingActionConfirm = initialPOSBatch;
    posObjectBatch['batchPosRequestList'] = data;
    posObjectBatch['batchPosManagementList'] = [];
    posObjectBatch['batchPosMaintenanceList'] = [];
    posObjectBatch['batchPosClaimList'] = [];
    posObjectBatch['requestValidate'] = requestValidate!;
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("posManagement/pendingActions/confirm", posObjectBatch).subscribe(res => {
        observer.next(res);

      });
    });
  }


  rejectPendingActions(data: any, rejectedReason: string): Observable<any> {
    let posObject: PendingActionValidation = initialPOS;
    posObject['posRequestBatchList'] = data;
    posObject['rejectedReason'] = rejectedReason;
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("posManagement/pendingActions/refuse", posObject).subscribe(res => {
        observer.next(res);

      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.accountNumber",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber'
    },
    {
      title: "pending-actions.request-type",
      type: TableHeaderType.TEXT,
      fieldName: 'typeRequest',
      mapObject: this.mapObject
    },
    {
      title: "pending-actions.contact-name",
      type: TableHeaderType.TEXT,
      fieldName: 'contactName',
    },
    {
      title: "pending-actions.mobile-number",
      type: TableHeaderType.TEXT,
      fieldName: 'mobile',
      mapObject: this.mapObject
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

export class PosManagementPendingAction extends PendingActionModel {
  mapObject = {
    "R001": "Request a POS Terminal",
    "R002": "Requesting Additional Terminals",
    "R003": "Request Enrollment in the e.commerce"
  };

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-pos-management-approved";
  override successRejectMessage = "pending-actions.selected-pos-management-rejected";

  getPendingActions(data: PendingActionPaginationPOS): Observable<any> {
    data['typeSearch'] = 'MANAGEMENT';
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("posManagement/pendingActions/list", data).subscribe(res => {
        observer.next(res.posManagementBatchList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    let posObject: PendingActionValidation = initialPOS;
    posObject['posManagementBatchList'] = data;
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("posManagement/pendingActions/validate", posObject).subscribe(res => {
        observer.next({
          batchList: res.batchPosManagementList,
          generateChallengeAndOTP: res.generateChallengeAndOTP
        });
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    let posObjectBatch: PendingActionConfirm = initialPOSBatch;
    posObjectBatch['batchPosManagementList'] = data;
    posObjectBatch['batchPosMaintenanceList'] = [];
    posObjectBatch['batchPosClaimList'] = [];
    posObjectBatch['batchPosRequestList'] =[];
    posObjectBatch['requestValidate'] = requestValidate!;
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("posManagement/pendingActions/confirm", posObjectBatch).subscribe(res => {
        observer.next(res);
      });
    });
  }

  rejectPendingActions(data: any, rejectedReason: string): Observable<any> {
    let posObject: PendingActionValidation = initialPOS;
    posObject['posManagementBatchList'] = data;
    posObject['rejectedReason'] = rejectedReason;
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("posManagement/pendingActions/refuse", posObject).subscribe(res => {
        observer.next(res);
      });
    });
  }


  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.accountNumber",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber'
    },
    {
      title: "pending-actions.request-type",
      type: TableHeaderType.TEXT,
      fieldName: 'typeRequest',
      mapObject: this.mapObject
    },
    {
      title: "pending-actions.contact-name",
      type: TableHeaderType.TEXT,
      fieldName: 'contactName',
    },
    {
      title: "pending-actions.mobile-number",
      type: TableHeaderType.TEXT,
      fieldName: 'mobile',
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

export class PosMaintenancePendingAction extends PendingActionModel {
  mapObject = {
    "R001": "Request a POS Terminal",
    "R002": "Requesting Additional Terminals",
    "R003": "Request Enrollment in the e.commerce"
  };

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-pos-maintenance-approved";
  override successRejectMessage = "pending-actions.selected-pos-maintenance-rejected";

  // review flow

  getPendingActions(data: PendingActionPaginationPOS): Observable<any> {
    data['typeSearch'] = 'MAINTENANCE';
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("posManagement/requestStatus/maintenance/list", data).subscribe(res => {
        observer.next(res.posMaintenanceBatchList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    let posObject: PendingActionValidation = initialPOS;
    posObject['posMaintenanceBatchList'] = data;
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("posManagement/pendingActions/validate", posObject).subscribe(res => {
        observer.next({
          batchList: res.batchPosMaintenanceList,
          generateChallengeAndOTP: res.generateChallengeAndOTP
        });
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    let posObjectBatch: PendingActionConfirm = initialPOSBatch;
    posObjectBatch['batchPosMaintenanceList'] = data;
    posObjectBatch['batchPosClaimList'] = [];
    posObjectBatch['batchPosRequestList'] = [];
    posObjectBatch['batchPosManagementList'] = [];
    posObjectBatch['requestValidate'] = requestValidate!;
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("posManagement/pendingActions/confirm", posObjectBatch).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, rejectedReason: string): Observable<any> {
    let posObject: PendingActionValidation = initialPOS;
    posObject['posMaintenanceBatchList'] = data;
    posObject['rejectedReason'] = rejectedReason;

    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("posManagement/pendingActions/refuse", posObject).subscribe(res => {
        observer.next(res);
      });
    });
  }


  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.accountNumber",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber'
    },
    {
      title: "pending-actions.request-type",
      type: TableHeaderType.TEXT,
      fieldName: 'typeRequest',
      mapObject: this.mapObject
    },
    {
      title: "pending-actions.contact-name",
      type: TableHeaderType.TEXT,
      fieldName: 'contactName',
    },
    {
      title: "pending-actions.mobile-number",
      type: TableHeaderType.TEXT,
      fieldName: 'mobile',
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

export class ClaimsPendingAction extends PendingActionModel {

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }

  override successApproveMessage = "pending-actions.selected-pos-claims-approved";
  override successRejectMessage = "pending-actions.selected-pos-claims-rejected";

  getPendingActions(data: PendingActionPaginationPOS): Observable<any> {
    data['typeSearch'] = 'CLAIM';
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("posManagement/pendingActions/list", data).subscribe(res => {
        observer.next(res.posClaimBatchList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    let posObject: PendingActionValidation = initialPOS;
    posObject['posClaimBatchList'] = data;
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("posManagement/pendingActions/validate", posObject).subscribe(res => {
        observer.next({
          batchList: res.batchPosClaimList,
          generateChallengeAndOTP: res.generateChallengeAndOTP
        });
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    let posObjectBatch: PendingActionConfirm = initialPOSBatch;
    posObjectBatch['batchPosClaimList'] = data;
    posObjectBatch['batchPosRequestList'] = [];
    posObjectBatch['batchPosManagementList'] = [];
    posObjectBatch['batchPosMaintenanceList'] = [];
    posObjectBatch['requestValidate'] = requestValidate!;
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("posManagement/pendingActions/confirm",
        posObjectBatch
      ).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, rejectedReason: string): Observable<any> {
    let posObject: PendingActionValidation = initialPOS;
    posObject['posClaimBatchList'] = data;
    posObject['rejectedReason'] = rejectedReason;
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("posManagement/pendingActions/refuse", posObject).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.accountNumber",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber'
    },
    {
      title: "pending-actions.transaction-amount",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber'
    },
    {
      title: "pending-actions.transaction-date",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber'
    },
    {
      title: "pending-actions.reconciliation-amount",
      type: TableHeaderType.TEXT,
      fieldName: 'accountNumber'
    },
    {
      title: "pending-actions.mobile-number",
      type: TableHeaderType.TEXT,
      fieldName: 'mobile',
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


export interface PendingActionPaginationPOS {
  page: number;
  rows: number;
  typeSearch: 'REQUEST' | 'MANAGEMENT' | 'MAINTENANCE' | 'CLAIM';
}

export interface PendingActionValidation {
  posRequestBatchList: Batch[];
  posManagementBatchList: Batch[];
  posMaintenanceBatchList: Batch[];
  posClaimBatchList: Batch[];
  rejectedReason?: string;
}

export const initialPOS: PendingActionValidation = {
  posRequestBatchList: [],
  posManagementBatchList: [],
  posMaintenanceBatchList: [],
  posClaimBatchList: []
};

export interface PendingActionConfirm {
  batchPosRequestList: Batch[];
  batchPosManagementList: Batch[];
  batchPosMaintenanceList: Batch[];
  batchPosClaimList: Batch[];
  requestValidate: RequestValidate;
}

export const initialPOSBatch: PendingActionConfirm = {
  batchPosRequestList: [],
  batchPosManagementList: [],
  batchPosMaintenanceList: [],
  batchPosClaimList: [],
  requestValidate: {}
};
