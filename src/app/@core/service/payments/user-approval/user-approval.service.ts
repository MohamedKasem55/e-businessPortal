import { Injectable } from '@angular/core';
import { AramcoPaymentUserApprovalReq } from 'app/@core/model/rest/payments/user-approval/aramco-payment-user-approval-req';
import { AramcoPaymentUserApprovalRes } from 'app/@core/model/rest/payments/user-approval/aramco-payment-user-approval-res';
import { BillPaymentUserApprovalReq } from 'app/@core/model/rest/payments/user-approval/bill-payment-user-approval-req';
import { BillPaymentUserApprovalRes } from 'app/@core/model/rest/payments/user-approval/bill-payment-user-approval-res';
import { EsalUserApprovalReq } from 'app/@core/model/rest/payments/user-approval/esal-user-approval-req';
import { EsalUserApprovalRes } from 'app/@core/model/rest/payments/user-approval/esal-user-approval-res';
import { GovernmentUserApprovalReq } from 'app/@core/model/rest/payments/user-approval/government-user-approval-req';
import { GovernmentPaymentsUserApprovalRes, GovernmentRefundsUserApprovalRes } from 'app/@core/model/rest/payments/user-approval/government-user-approval-res';
import { HajjUmrahAllocatedUserApprovalRes } from 'app/@core/model/rest/payments/user-approval/hajjumra-allocated-user-approval-res';
import { HajjUmrahOperationsUserApprovalRes } from 'app/@core/model/rest/payments/user-approval/hajjumra-operations-user-approval-res';
import { HajjUmrahUserApprovalReq } from 'app/@core/model/rest/payments/user-approval/hajjumra-user-approval-req';
import { Observable } from "rxjs";
import { AbstractBaseService } from "../../base/abstract-base.service";
import { UserApprovalConstants } from "./user-approval-urls";

@Injectable()
export class UserApprovalService extends AbstractBaseService {

  getBillPaymentUserApproval(billPaymentUserApprovalReq: BillPaymentUserApprovalReq): Observable<BillPaymentUserApprovalRes> {
    return this.post(UserApprovalConstants.BILL_PAYMENT_LIST,
      billPaymentUserApprovalReq, {hideLoader: true});
  }

  getEsalUserApproval(esalUserApprovalReq: EsalUserApprovalReq): Observable<EsalUserApprovalRes> {
    return this.post(UserApprovalConstants.ESAL_LIST,
      esalUserApprovalReq, {hideLoader: true});
  }

  getAramcoPaymentUserApproval(aramcoPaymentUserApprovalReq: AramcoPaymentUserApprovalReq): Observable<AramcoPaymentUserApprovalRes> {
    return this.post(UserApprovalConstants.ARAMCO_PAYMENT_LIST,
      aramcoPaymentUserApprovalReq, {hideLoader: true});
  }

  getHajjAllocatedUserApproval(hajjAllocatedUserApprovalReq: HajjUmrahUserApprovalReq): Observable<HajjUmrahAllocatedUserApprovalRes> {
    return this.post(UserApprovalConstants.HAJJUMRA_ALLOCATED_LIST,
      hajjAllocatedUserApprovalReq, {hideLoader: true});
  }

  getHajjOperationUserApproval(hajjOperationUserApprovalReq: HajjUmrahUserApprovalReq): Observable<HajjUmrahOperationsUserApprovalRes> {
    return this.post(UserApprovalConstants.HAJJUMRA_OPERATION_LIST,
      hajjOperationUserApprovalReq, {hideLoader: true});
  }

  getGovernmentPaymentsUserApproval(governmentPaymentsUserApprovalReq: GovernmentUserApprovalReq): Observable<GovernmentPaymentsUserApprovalRes> {
    return this.post(UserApprovalConstants.GOVERNMENT_PAYMENTS_LIST,
      governmentPaymentsUserApprovalReq, {hideLoader: true});
  }

  getGovernmentRefundsUserApproval(governmentRefundsUserApprovalReq: GovernmentUserApprovalReq): Observable<GovernmentRefundsUserApprovalRes> {
    return this.post(UserApprovalConstants.GOVERNMENT_REFUNDS_LIST,
      governmentRefundsUserApprovalReq, {hideLoader: true});
  }
}
