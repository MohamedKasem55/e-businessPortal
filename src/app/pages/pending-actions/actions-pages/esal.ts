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

export class EsalPendingActionsPage implements PendingActionPage {

  constructor(private pendingActionsService: PendingActionsService, private datePipe: DatePipe) {
  }

  title = "pending-actions.esal";
  workflowType: WorkflowType[] = [{
    type: 'SI',
    isFinancial: true
  }];
  pendingActions: PendingActionModel[] = [
    new EsalPendingAction(this.pendingActionsService, this.datePipe)];
}


export class EsalPendingAction extends PendingActionModel {
  override serviceMapObjects = ["branchRbs5", "currencyIso", "currency", "cityType", "currencyDecimals"];

  constructor(private pendingActionsService: PendingActionsService, private _datePipe: DatePipe) {
    super(_datePipe);
  }


  override successApproveMessage = "pending-actions.selected-esal-approved";
  override successRejectMessage = "pending-actions.selected-esal-rejected";


  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("sadadInvoice/pendingActions/list", data).subscribe(res => {
        observer.next(res.saddadInvoicePagedResults);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("sadadInvoice/validate", { batchList: data, pending: 'true' }).subscribe(res => {
        observer.next({
          batchList: res.batchList,
          generateChallengeAndOTP: res.generateChallengeAndOTP ? res.generateChallengeAndOTP : {},
          requiredSFA: res.requiredSFA
        });
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("sadadInvoice/confirm", {
        batchList: data,
        requestValidate,
        pending: true,
        sendMails: false
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("sadadInvoice/refuse", {
        batchLists: data,
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
    { title: "pending-actions.invoice-number", type: TableHeaderType.TEXT, fieldName: 'invoiceId' },
    { title: "pending-actions.supplier-name", type: TableHeaderType.TEXT, fieldName: 'billerName' },
    { title: "pending-actions.supplier-id", type: TableHeaderType.TEXT, fieldName: 'billerId' },
    { title: "pending-actions.due-amount", type: TableHeaderType.TEXT, fieldName: 'amountDue' },
    {
      title: "pending-actions.due-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: { format: 'dd/MM/yyyy' },
      fieldName: 'dateDue'
    },
    { title: "pending-actions.additional-details", type: TableHeaderType.TEXT, fieldName: 'additionalDetails' },
    { title: "pending-actions.buyer-name", type: TableHeaderType.TEXT, fieldName: 'buyerName' },
    { title: "pending-actions.pay", type: TableHeaderType.TEXT, fieldName: 'amountPayment' },
    { title: "pending-actions.total", type: TableHeaderType.TEXT, fieldName: 'amountPayment' },
    { title: "pending-actions.from-account", type: TableHeaderType.TEXT, fieldName: 'accountNumber' },
    {
      title: "pending-actions.amount",
      fieldName: "amount",
      type: TableHeaderType.AMOUNT_TEXT,
      controlOptions: {
        currency: "currency"   /*Account Currency*/
      }
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




