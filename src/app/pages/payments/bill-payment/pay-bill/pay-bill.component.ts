import {Component, OnInit} from '@angular/core';
import {PaymentBaseComponent} from "../../payment-base/payment-base.component";
import {buildAccountForm} from "./pay-bill.controls";
import {BillPaymentService} from "../../../../@core/service/payments/bill-payments/bill-payment.service";
import {BillPaymentValidateRes} from "../../../../@core/model/rest/payments/billPayment/bill-payment-validate-res";
import {FormResult, PageModel} from "../../../../@core/model/dto/formModel";
import {RequestValidate} from "../../../../@core/model/rest/common/otp.model";
import {PopupService} from "../../../../@core/service/base/popup.service";
import {VerificationService} from "../../../../@core/service/base/verification.service";
import {ResponseException} from "../../../../@core/service/base/responseException";
import {BillPayConfirmReq} from "../../../../@core/model/rest/payments/billPayment/bill-pay-confirm-req";
import {ResultModal} from "../../../../@core/model/dto/result.modal";
import {BillPaymentValidateReq} from "../../../../@core/model/rest/payments/billPayment/bill-payment-validate-req";
import {FormButtonClickOutput} from "../../../../shared/form/form.component";
import {PendingActionFactory} from 'app/@core/service/base/pending-action-factory.service';

@Component({
  selector: 'app-pay-bill',
  templateUrl: '../../payment-base/payment-base.component.html',
  styleUrls: []
})
export class PayBillComponent extends PaymentBaseComponent implements OnInit {
  accounts: any[] = []
  selectedBills: any[] = []
  billPaymentValidateRes!: BillPaymentValidateRes
  isPending: boolean = true;

  constructor(private billPaymentService: BillPaymentService,
              private popupService: PopupService,
              private pendingActionFactory: PendingActionFactory,
              private otpService: VerificationService) {
    super();
    this.setBreadcrumb([
      {
        text: 'payments.name',
        url: '/payments'
      },
      {
        text: 'payments.bill-payment.name',
        url: ''
      },
      {
        text: 'payments.pay-bill.name',
        url: ''
      }
    ]);
    this.drawPage()
    this.getAccount()
  }

  drawPage() {
    this.pageTitle.id = "payBillTitle";
    this.pageTitle.title = "payments.pay-bill.name";
    this.pageTitle.endButtons = []
    this.endButtons = [this.confirmButton]
    this.endButtons[0].isDisable = true
    this.pageTitle.stepper!.steps = ["", "", ""];
    this.pages = [new PageModel(1, buildAccountForm())];
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    for (const button of this.endButtons) {
      button.isDisable = !valid
    }
  }

  private getAccount() {
    if (history.state.accounts) {
      this.accounts = history.state.accounts
      let control = this.getControl(0, 0, "fromAccountControl");
      control.controlOptions.options = this.accounts;
      control.setValue(this.accounts[0]);
    } else {
      this.goToBillPayment();
    }
    if (history.state.selectedBills) {
      this.selectedBills = history.state.selectedBills
    } else {
      this.goToBillPayment();
    }
  }

  goToBillPayment(selectedBills?: any) {
    void this.router.navigateByUrl('/payments/bill-payment', {state: {selectedBills: selectedBills}})
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Confirm':
        this.clickNext()
        break;
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'Payments':
        this.goToPayments()
        break;
      case 'PendingActions':
        void this.router.navigate(["/pendingActions/pending-actions-list"]);
        break;

    }
  }

  private backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.goToBillPayment(this.selectedBills);
        break;
      case 2:
      case 3:
        this.stepperMoveBack();
        break;
    }
  }


  private clickNext() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.validateSelectedBills(true)
        break
      case 2:
        this.validateSelectedBills()
        break
    }
  }

  showOtp() {
    this.otpService.showVerification(this.billPaymentValidateRes.generateChallengeAndOTP!)
      .subscribe((requestValidate: RequestValidate) => {
        this.confirmAddBill(requestValidate);
      });
  }

  getConfirmRequest(requestValidate?: RequestValidate): BillPayConfirmReq {
    return {
      emailChecked: "0",
      requestValidate: requestValidate,
      batchListsContainer: this.billPaymentValidateRes.batchListsContainer
    }
  }

  private confirmAddBill(requestValidate?: RequestValidate) {
    this.billPaymentService.confirmPayBill(this.getConfirmRequest(requestValidate)).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.summary = {}
          this.endButtons = (this.getConfirmRequest(requestValidate).batchListsContainer!.toAuthorize?.length ) || this.showPendingActions ? [this.pendingActionsButton, this.paymentsButton,] : [this.paymentsButton];
          this.startButtons = [];
          this.result = this.fillSuccessResult();
          if (res['hasNextApprovalLevel']) {
            this.pendingActionFactory.fetchPendingActions();
          }
        },
        error: (error: ResponseException) => {
        }
      })
  }

  private validateSelectedBills(inquiry?: boolean) {
    let billPayValidateReq: BillPaymentValidateReq = {}
    billPayValidateReq.accountNumber = this.getControl(0, 0, 'fromAccountControl').value.fullAccountNumber
    billPayValidateReq.billSelected = []
    billPayValidateReq.emailChecked = '0'
    this.selectedBills.forEach((item: any) => {
      billPayValidateReq.billSelected!.push({
        billCodeSelected: item.billCode,
        billReference: item.billRef.trim(),
        dueDate: new Date(item.dueDate),
        amountPaid: Number(item.amount),
        nickName: item.nickname
      })
    })
    if (billPayValidateReq.billSelected.length > 0) {
      this.billPaymentService.validatePayBill(billPayValidateReq, inquiry).subscribe((res) => {
        this.billPaymentValidateRes = res;
        if (inquiry) {
          this.summary = this.fillBillSummary(true, this.billPaymentValidateRes)
          this.stepperMoveNext()
        } else {
          this.billPaymentValidateRes.batchListsContainer.toProcess.length > 0 ? this.showOtp() : this.confirmAddBill()
        }
      })
    }

  }

  fillSuccessResult(): ResultModal {
    return {
      type: this.billPaymentValidateRes.batchListsContainer.toAuthorize?.length
        ? 'Pending' : 'Success',
      title: this.billPaymentValidateRes.batchListsContainer.toAuthorize?.length
        ? 'payments.pay-bill.paid-pending' : 'payments.pay-bill.paid-successfully',
      summary: this.fillBillSummary(false, this.billPaymentValidateRes)
    };
  }

}
