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

export class AramcoPaymentsPendingActionsPage implements PendingActionPage {

  constructor(
    private pendingActionsService: PendingActionsService,
    private datePipe: DatePipe) {
  }

  title = "pending-actions.aramco";
  paymentType = ['AO'];
  workflowType: WorkflowType[] = [{
    type: 'AO',
    isFinancial: true
  }];
  pendingActions: PendingActionModel[] = [
    new AramcoPaymentsPendingAction(this.pendingActionsService, this.datePipe)];
}


export class AramcoPaymentsPendingAction extends PendingActionModel {
  override serviceMapObjects = ["branchRbs5", "currencyIso", "currency", "cityType", "currencyDecimals"];

  constructor(private pendingActionsService: PendingActionsService,
    private _datePipe: DatePipe) {
    super(_datePipe);
  }


  override successApproveMessage = "pending-actions.selected-aramco-payments-approved";
  override successRejectMessage = "pending-actions.selected-aramco-payments-rejected";


  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("aramcoPaymets/pendingActions/list", data).subscribe(res => {
        observer.next(res.pendingAramcoPaymenList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("aramcoPaymets/pendingActions/validate", { aramcoBatchList: data }).subscribe(res => {
        observer.next({
          batchList: res.aramcoBatchList,
          generateChallengeAndOTP: res.generateChallengeAndOTP ? res.generateChallengeAndOTP : {}
        });
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("aramcoPaymets/pendingActions/confirm", {
        aramcoBatchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, rejectReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("aramcoPaymets/pendingActions/refuse", {
        aramcoBatchList: data,
        rejectReason
      }).subscribe(res => {
        ;
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
    { title: "pending-actions.aramco-pass-number", type: TableHeaderType.TEXT, fieldName: 'passNumber' },
    { title: "pending-actions.account", type: TableHeaderType.TEXT, fieldName: 'accountNumber' },
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




