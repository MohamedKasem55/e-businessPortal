import {
  PendingActionModel,
  PendingActionPage,
  PendingActionPagination, ValidatePendingActionsResponse, WorkflowType
} from "../../../@core/model/dto/pending-actions-model";
import { PendingActionsService } from "../../../@core/service/pending-actions/pending-actions-service";
import { DatePipe } from "@angular/common";
import { Observable, Subscriber } from "rxjs";
import { RequestValidate } from "../../../@core/model/rest/common/otp.model";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";
import { TableHeaderType } from "arb-design-library";
import { getCurrentLevelControlOptions } from "./current-level-control-options";
import { SummaryModel } from "arb-design-library/model/summary.model";
import { BatchList } from "app/@core/model/rest/common/batchResponse";
import { ModelAndListService } from "app/@core/service/base/modelAndList.service";

export class StandingOrdersPendingActionsPage implements PendingActionPage {

  constructor(private pendingActionsService: PendingActionsService, private datePipe: DatePipe,private modelAndListService: ModelAndListService) {
  }

  title = "pending-actions.standingOrders";
  workflowType: WorkflowType[] = [{
    type: 'SO',
    isFinancial: true
  }];
  pendingActions: PendingActionModel[] = [
    new StandingOrdersPendingAction(this.pendingActionsService, this.datePipe,this.modelAndListService)];
}


export class StandingOrdersPendingAction extends PendingActionModel {

  override serviceMapObjects = ["purposeType", "currencyIso", "currency"];
  mapObject =
    {
      "1": "Every 1 month/s",
      "3": "Every 3 month/s",
      "6": "Every 6 month/s",
      "12": "Every 12 month/s",
      "00": "Add",
      "01": "Modify",
      "02": "Delete",
    };

  mapAmountType = {
    0: 'transfer.standingOrder.amount',
    1: 'transfer.standingOrder.minBlnc'
  }

  mapPurpose:any

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe, private modelAndListService: ModelAndListService,
    ) {
    super(_datePipe);
    this.modelAndListService.getList(["purposeType"]).subscribe(res => {
      this.mapPurpose=res
    });
  }

  override successApproveMessage = "pending-actions.selected-standing-orders-approved";
  override successRejectMessage = "pending-actions.selected-standing-orders-rejected";


  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("standingOrders/pendingActions/getList", data).subscribe(res => {
        observer.next(res.pendingStandingOrderList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("standingOrders/pendingActions/authorizeValidate", { batchSetAuth: data }).subscribe(res => {
        observer.next({
          batchList: res.authorizationPermission,
          generateChallengeAndOTP: res.generateChallengeAndOTP ? res.generateChallengeAndOTP : {}
        });
      });
    });
  }

  override rejectValidatePendingActions(data: any, rejectionReason: string): Observable<any[]> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("standingOrders/pendingActions/refuseValidate", { batchSetRefuse: data }).subscribe(res => {
        observer.next(res.authorizationPermission);
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("standingOrders/pendingActions/authorizeConfirm", {
        batchListStandingOrders: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, reason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("standingOrders/pendingActions/refuseConfirm", {
        batchStandingRefuses: data,
        reason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  //add validate refuse

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.initiation-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'initiationDate'
    },
    { title: "pending-actions.from-account", type: TableHeaderType.TEXT, fieldName: 'accountNumber' },
    {
      title: "pending-actions.amount",
      fieldName: "amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {
        currency: "currency"   /*Account Currency*/
      }
    },
    { title: "pending-actions.operation", type: TableHeaderType.TEXT, fieldName: 'option', mapObject: this.mapObject },
    {
      title: "pending-actions.payment-type",
      type: TableHeaderType.TEXT,
      fieldName: 'paymentType',
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




    summaryTable: TableHeaderModel[] = [
      {
        title: "pending-actions.initiation-date",
        type: TableHeaderType.DATE_TEXT,
        controlOptions: { format: 'dd/MM/yyyy' },
        fieldName: 'initiationDate'
      },
      { title: "pending-actions.from-account", type: TableHeaderType.TEXT, fieldName: 'accountNumber' },
      {
        title: "pending-actions.beneficiary-account",
        type: TableHeaderType.TEXT,
        fieldName: 'beneficiaryAccount',
      },
      {
        title: "pending-actions.beneficiary-name",
        type: TableHeaderType.TEXT,
        fieldName: 'beneficiaryName',
      },
      {
        title: "pending-actions.amount-type",
        fieldName: "amountType",
        type: TableHeaderType.TEXT,
        mapObject: this.mapAmountType
      },
      {
        title: "pending-actions.amount",
        fieldName: "amount",
        type: TableHeaderType.AMOUNT_TEXT,
        controlOptions: {
          currency: "currency"   /*Account Currency*/
        }
      },
      { title: "pending-actions.operation", type: TableHeaderType.TEXT, fieldName: 'option', mapObject: this.mapObject },
      {
        title: "pending-actions.payment-type",
        type: TableHeaderType.TEXT,
        fieldName: 'paymentType',
        mapObject: this.mapObject
      },
      {
        title: "pending-actions.number-payments",
        type: TableHeaderType.TEXT,
        fieldName: 'paymentNumber',
      },
      {
        title: "pending-actions.day-of-month",
        type: TableHeaderType.TEXT,
        fieldName: 'dayMonth',
      },
      {
        title: "pending-actions.date-from",
        type: TableHeaderType.DATE_TEXT,
        controlOptions: { format: 'dd/MM/yyyy' },
        fieldName: 'dateFrom'
      },
      {
        title: "pending-actions.date-to",
        type: TableHeaderType.DATE_TEXT,
        controlOptions: { format: 'dd/MM/yyyy' },
        fieldName: 'dateTo'
      },
      {
        title: "pending-actions.purpose",
        type: TableHeaderType.TEXT,
        fieldName: 'purpose',
        mapObject: 'purposeType'
      },
      {
        title: "pending-actions.remarks",
        type: TableHeaderType.TEXT,
        fieldName: 'remarks',
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



  override getSummary(title: string, isApprove: boolean, data: BatchList, headers: TableHeaderModel[]): SummaryModel {
    headers = this.summaryTable;
    headers.forEach((item: TableHeaderModel) => {
      if (item.mapObject) {
        if (this.mapPurpose[item.mapObject]) {
          item.mapObject = this.mapPurpose[item.mapObject];
        }
      }
    });
    let length = 0;
    let summary: SummaryModel;
    if (data.notAllowed.length > 0 || data.toAuthorize?.length || data.toProcess.length > 0) {
      length = data.notAllowed.length + (data.toAuthorize ? data.toAuthorize.length : 0) + data.toProcess.length;
    } else if (data.toReject && !isApprove) {
      length = data.toReject.length
    }
    if (length && length >= 7) {
      summary = this.buildTablePage(title, isApprove, data, headers);
    } else {
      summary = this.buildSummaryPage(title, isApprove, data, headers);
    }
    return summary;
  }

}




