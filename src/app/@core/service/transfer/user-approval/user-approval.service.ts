import { Injectable } from '@angular/core';
import { AbstractBaseService } from "../../base/abstract-base.service";
import { UserApprovalConstants } from "./user-approval-urls";
import { TransferUserApprovalReq } from "../../../model/rest/transfer/user-approval/transfer-user-approval-req";
import { Observable } from "rxjs";
import { BeneficiariesRes, BulkPaymentsRes, StandingOrdersRes, TransferUserApprovalRes } from "../../../model/rest/transfer/user-approval/transfer-user-approval-res";

@Injectable()
export class UserApprovalService extends AbstractBaseService {

  getTransferUserApproval(transferUserApprovalReq: TransferUserApprovalReq): Observable<TransferUserApprovalRes> {
    return this.post(UserApprovalConstants.TRANSFER_BATCH_LIST,
      transferUserApprovalReq, {hideLoader: true});
  }
  getBeneficiariesList(beneficiariesReq: TransferUserApprovalReq): Observable<BeneficiariesRes> {
    return this.post(UserApprovalConstants.BENEFICIARIES_BATCH_LIST, beneficiariesReq, {hideLoader: true});
  }
  getStandingOrdersList(standingOrdersReq: TransferUserApprovalReq): Observable<StandingOrdersRes> {
    return this.post(UserApprovalConstants.STANDING_ORDERS_LIST, standingOrdersReq, {hideLoader: true});
  }
  getBulkPaymentsList(bulkPaymentsReq: TransferUserApprovalReq): Observable<BulkPaymentsRes> {
    return this.post(UserApprovalConstants.BULK_PAYMENTS_LIST, bulkPaymentsReq, {hideLoader: true});
  }
}
