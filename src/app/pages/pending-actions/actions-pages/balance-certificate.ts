import {
  PendingActionModel,
  PendingActionPage,
  PendingActionPagination, ValidatePendingActionsResponse, WorkflowType
} from "../../../@core/model/dto/pending-actions-model";
import {PendingActionsService} from "../../../@core/service/pending-actions/pending-actions-service";
import {DatePipe} from "@angular/common";
import {Observable, Subscriber} from "rxjs";
import {RequestValidate} from "../../../@core/model/rest/common/otp.model";
import {TableHeaderModel} from "arb-design-library/model/table-header.model";
import {TableHeaderType} from "arb-design-library";
import {getCurrentLevelControlOptions} from "./current-level-control-options";

export class BalanceCertificatePendingActionsPage implements PendingActionPage {

  constructor(private pendingActionsService: PendingActionsService, private datePipe: DatePipe) {
  }

  title = "pending-actions.balanceCertificate";
  workflowType: WorkflowType[] = [{
    type: 'BC',
    isFinancial: false
  }];
  pendingActions: PendingActionModel[] = [
    new BalanceCertificatePendingAction(this.pendingActionsService, this.datePipe)];
}


export class BalanceCertificatePendingAction extends PendingActionModel {
  override serviceMapObjects = ["branchRbs5", "currencyIso", "currency", "cityType", "currencyDecimals"];

  constructor(private pendingActionsService: PendingActionsService, _datePipe: DatePipe) {
    super(_datePipe);
  }


  override successApproveMessage = "pending-actions.selected-balance-certificate-approved";
  override successRejectMessage = "pending-actions.selected-balance-certificate-rejected";


  getPendingActions(data: PendingActionPagination): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.getPendingActionsService("balanceCertificate/pendingActions/list", data).subscribe(res => {
        observer.next(res.batchList);
      });
    });
  }

  validatePendingActions(data: any): Observable<ValidatePendingActionsResponse> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.postPendingActionsService("balanceCertificate/pendingActions/validate", {batchList: data}).subscribe(res => {
        observer.next(res);
      });
    });
  }

  confirmPendingActions(data: any, requestValidate?: RequestValidate): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("balanceCertificate/pendingActions/confirm", {
        batchList: data,
        requestValidate
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }


  rejectPendingActions(data: any, rejectionReason: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.pendingActionsService.putPendingActionsService("balanceCertificate/pendingActions/refuse", {
        batchList: data,
        rejectionReason
      }).subscribe(res => {
        observer.next(res);
      });
    });
  }

  override table: TableHeaderModel[] = [
    {
      title: "pending-actions.request-date",
      type: TableHeaderType.DATE_TEXT,
      controlOptions: {format: 'dd/MM/yyyy'},
      fieldName: 'initiationDate'
    },
    {title: "pending-actions.account", type: TableHeaderType.TEXT, fieldName: 'accountNumber'},
    {title: "pending-actions.company", type: TableHeaderType.TEXT, fieldName: 'company'},
    {title: "pending-actions.city", type: TableHeaderType.TEXT, fieldName: 'city', mapObject: 'cityType'},
    {title: "pending-actions.postal-code", type: TableHeaderType.TEXT, fieldName: 'postalCode'},
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




