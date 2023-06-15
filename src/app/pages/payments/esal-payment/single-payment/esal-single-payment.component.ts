import {DatePipe} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ControlBase} from "app/@core/model/dto/control/control.model";
import {FormResult, PageModel} from "app/@core/model/dto/formModel";
import {ResultModal} from "app/@core/model/dto/result.modal";
import {ValidationsEnum} from "app/@core/model/dto/validations-enum";
import {RequestValidate} from "app/@core/model/rest/common/otp.model";
import {EsalPaymentConfirmReq} from "app/@core/model/rest/payments/esal-payment/esal-payment-confirm-req.model";
import {FetchEsalBatchReq} from "app/@core/model/rest/payments/esal-payment/esal-payment-item-fetching-req.model";
import {EsalPaymentItemRes} from "app/@core/model/rest/payments/esal-payment/esal-payment-item-res.model";
import {EsalPaymentValidateReq} from "app/@core/model/rest/payments/esal-payment/esal-payment-validate-req.model";
import {EsalPaymentValidateRes} from "app/@core/model/rest/payments/esal-payment/esal-payment-validate-res.model";
import {PendingActionFactory} from "app/@core/service/base/pending-action-factory.service";
import {ResponseException} from "app/@core/service/base/responseException";
import {VerificationService} from "app/@core/service/base/verification.service";
import {EsalPaymentService} from "app/@core/service/payments/esal-payment/esal-payment.service";
import {UserProfileService} from "app/@core/service/user-profile/user-profile.service";
import {FormButtonClickOutput} from "app/shared/form/form.component";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {AuthenticationUtils} from "../../../../@core/utility/authentication-utils";
import {PaymentBaseComponent} from "../../payment-base/payment-base.component";
import {esalPaymentOptions, payEsalForm} from "../esal-payment-comman-controls";
import {accountDetailsForm, billInformationForm} from "./esal-single-payment-controls";


@Component({
  selector: 'app-esal-single-payment',
  templateUrl: '../../payment-base/payment-base.component.html',
  styleUrls: []
})
export class EsalSinglePaymentComponent extends PaymentBaseComponent implements OnInit {
  esalPaymnentListAgainstInvoice!: EsalPaymentItemRes;
  esalSinglePaymentValidateResponse!: EsalPaymentValidateRes;
  esalSinglePaymentRequiredField!: any;

  constructor(
    public override router: Router,
    private esalPaymentService: EsalPaymentService,
    private userProfileService: UserProfileService,
    private datePipe: DatePipe,
    private otpService: VerificationService,
    private pendingActionFactory: PendingActionFactory
  ) {

    super();
    this.showPendingActions = AuthenticationUtils.showPendingActions;
    this.setBreadcrumb([
      {
        text: 'payments.name',
        url: 'payments'
      },
      {
        text: 'payments.esal.esal-payment',
        url: 'payments/esal-payment'
      },
      {
        text: 'payments.esal.pay-single-invoice',
        url: ''
      }]);

    this.pageTitle.id = "esal-payment-main-page";
    this.pageTitle.showArrow = true;
    this.pageTitle.title = "payments.esal.title";
    this.pageTitle.endButtons = this.showPendingActions ? [this.analyticsButton, this.statementButton, this.approvalStatusButton] : [this.analyticsButton, this.statementButton]
    this.pageTitle.stepper!.steps = ["", "", "", ""];

    this.pages = [
      new PageModel(1, payEsalForm(), accountDetailsForm()),
      new PageModel(2, accountDetailsForm(), billInformationForm())
    ]

    this.endButtons = [this.proceedButton];
    this.endButtons[0].isDisable = false;
    this.startButtons = [];
    this.getAndFillAccountList(this.getControl(0, 1, "fromAccount"));
    this.getControl(0, 1, "amount").disable();

    this.getControl(0, 0, "singleType").controlOptions.options = Object.entries(esalPaymentOptions).map(([key, value]) => ({
      key,
      value
    }));
    this.getControl(0, 0, "singleType").setValue({'key': 'singleInvoice', 'value': 'Single Invoice'});
    this.getControl(0, 0, "singleType").hidden = false;
    this.getControl(0, 0, "singleType").disable();
    this.getControl(0, 0, "payerIdNumber").label = this.translate.instant("payments.esal.invoice-id-number");

  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  buildEsalPaymentRequestByInvoiceId(invoiceId: string): FetchEsalBatchReq {
    return {
      page: 1,
      rows: 20,
      sadadInvoiceId: invoiceId
    }
  }

  drawEsalSingleInvoiceDetailPage(slectedAccount: string) {

    let esalSingleInvoicItem = this.esalPaymnentListAgainstInvoice.listBatch.items[0];
    this.startButtons = [this.backButton];
    this.endButtons = [this.nextButton];

    this.getAndFillAccountList(this.getControl(1, 0, "fromAccount"), slectedAccount);

    this.getControl(1, 0, "billerIdAndNameTitle").controlOptions.title = esalSingleInvoicItem.billerName;
    this.getControl(1, 0, "billerIdAndNameTitle").controlOptions.startButtons = [this.editButton];

    this.getControl(1, 0, "billerIdAndNameTitle").controlOptions.subTitle = this.translate.instant('payments.esal.bill-number') +
      " " + esalSingleInvoicItem.billerId;
    this.getControl(1, 1, "invoiceId").setValue(esalSingleInvoicItem.invoiceId);
    this.getControl(1, 1, "supplierId").setValue(esalSingleInvoicItem.billerId);
    this.getControl(1, 1, "amountDue").setValue(esalSingleInvoicItem.amountDue);
    this.getControl(1, 1, "buyerName").setValue(esalSingleInvoicItem.buyerName);
    this.getControl(1, 1, "dueDate").setValue(this.datePipe.transform(esalSingleInvoicItem.dateDue, 'MM/dd/YYYY'));
    this.getControl(1, 1, "additionalDetails").setValue(esalSingleInvoicItem.additionalDetails);


    if (esalSingleInvoicItem.billCategory === "EXACT") {
      this.getControl(1, 0, "amount").disable();
      this.getControl(1, 0, "amount").setValidators([]);
      this.getControl(1, 0, "amount").setValue(esalSingleInvoicItem.amountDue);
    } else if (esalSingleInvoicItem.billCategory === "PARTIAL") {

      this.getControl(1, 0, "amount").setValidators([]);
      this.getControl(1, 0, "amount").enable();
      this.getControl(1, 0, "amount").setValidators([
        {validation: ValidationsEnum.MIN, options: esalSingleInvoicItem.amountRangeFrom},
        {validation: ValidationsEnum.MAX, options: esalSingleInvoicItem.amountRangeTo},
      ])

      this.getControl(1, 0, "amount").validationLabels!.required = "transfer.amount-is-required";
      this.getControl(1, 0, "amount").validationLabels!.max = this.translate.instant("payments.esal.amount-pay-limit") + " " + esalSingleInvoicItem.amountRangeTo;
      this.getControl(1, 0, "amount").validationLabels!.min = this.translate.instant("payments.esal.amount-greater-than") + " " + esalSingleInvoicItem.amountRangeFrom;

    } else {

      this.getControl(1, 0, "amount").enable();
      this.getControl(1, 0, "amount").setValidators([]);
    }
  }

  getAndFillAccountList(control: ControlBase<any>, accountNumber?: string) {
    this.userProfileService.getSARAccountList().subscribe(data => {
      control.controlOptions.options = data.listAlertsPermissionAccount;
      if (data.listAlertsPermissionAccount.length > 0) {

        if (accountNumber) {
          let matchAccount = data.listAlertsPermissionAccount.find((obj) => {
            return obj.fullAccountNumber === accountNumber;
          });
          control.setValue(matchAccount ? matchAccount : data.listAlertsPermissionAccount[0]);
        } else {
          control.setValue(data.listAlertsPermissionAccount[0]);
        }
      }
    })
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput): void {
    console.log(formButtonClickOutput.buttonId);
    switch (formButtonClickOutput.buttonId) {
      case 'Proceed':
        this.nextClick()
        break;
      case 'Next':
      case 'Confirm':
        this.nextClick();
        break;
      case 'Back':
      case 'arrowTitle':
      case 'Edit':
        this.backClick();
        break;
      case 'Payments':
        this.router.navigateByUrl('/payments');
        break;
      case 'PendingActions':
        void this.router.navigate(["/pendingActions/pending-actions-list"]);
        break;
    }
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    if (this.esalPaymnentListAgainstInvoice &&
      this.esalPaymnentListAgainstInvoice.listBatch.items[0].billCategory === "EXACT") {
      this.endButtons[0].isDisable = false;
    } else {
      this.endButtons[0].isDisable = !valid;
    }
  }

  setEsalSingleInvoiceDetailPageConfig() {
    let invoiceId = this.getControl(0, 0, "payerIdNumber").value ? this.getControl(0, 0, "payerIdNumber").value : null;
    let selectedAccount = this.getControl(0, 1, "fromAccount").value.fullAccountNumber;
    this.esalSinglePaymentRequiredField = {"invoiceId": invoiceId, "selectedAccount": selectedAccount};
    this.fetchEsalInvoiceDetails(invoiceId);
  }

  fetchEsalInvoiceDetails(invoiceId: string) {
    this.esalPaymentService.fetchEsalPayment(this.buildEsalPaymentRequestByInvoiceId(invoiceId)).subscribe({
      next: (res) => {
        this.esalPaymnentListAgainstInvoice = res;
        this.stepperMoveNext();
        this.pageTitle.id = 'pay-single-invoice';
        this.pageTitle.showArrow = false;
        this.pageTitle.title = 'payments.esal.pay-single-invoice';
        this.pageTitle.endButtons = []
        this.drawEsalSingleInvoiceDetailPage(this.esalSinglePaymentRequiredField['selectedAccount']);
      },
      error: (error: ResponseException) => {
        console.error("Error while fetching esal payment against given id");
      }
    })
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.setEsalSingleInvoiceDetailPageConfig();
        break;
      case 2:
        this.validateSinglePayment();
        break;
      case 3:
        this.esalSinglePaymentValidateResponse.batchList.toProcess.length > 0 ? this.showOtp() : this.confirmSinglePayment();
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigate(["/payments/esal-payment"]).then(() => {
        });
        break;
      case 2:
        this.endButtons = [this.proceedButton];
        this.startButtons = [];
        this.pageTitle.showArrow = true;
        this.pageTitle.title = "payments.esal.title";
        this.stepperMoveBack();
        break;
      case 3:
        this.endButtons = [this.nextButton]
        this.startButtons = [this.backButton]
        this.pageTitle.showArrow = false;
        this.pageTitle.title = 'payments.esal.pay-single-invoice';
        this.endButtons[0].isDisable = false;
        this.stepperMoveBack();
        break;
    }
  }

  validateSinglePayment() {
    this.esalPaymentService.validateEsalPayment(this.buildSinglePaymentValidateReq()).subscribe(
      {
        next: (res) => {

          if (!res.errors) {
            this.stepperMoveNext();
            this.esalSinglePaymentValidateResponse = res;
            this.endButtons = [this.confirmButton];
            this.startButtons = [this.backButton];
            this.summary = this.fillSummary();
            window.scrollTo(0, 0);
          } else {
            this.stepperMoveNext();
            this.stepperMoveNext();
            this.endButtons = !this.showPendingActions ? [this.paymentsButton] : [this.pendingActionsButton, this.paymentsButton];
            this.startButtons = [];
            this.summary = {};
            this.result = this.fillErrorResult(res.errors[0]);
            window.scrollTo(0, 0);
          }
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.stepperMoveNext();
          this.endButtons = !this.showPendingActions ? [this.paymentsButton] : [this.pendingActionsButton, this.paymentsButton];
          this.startButtons = [];
          this.summary = {};
          this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
          window.scrollTo(0, 0);
        }
      })
  }

  confirmSinglePayment(requestValidate?: RequestValidate) {
    this.esalPaymentService.confirmEsalPayment(this.buildSinglePaymentConfirmReq(requestValidate)).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.endButtons = !this.showPendingActions ? [this.paymentsButton] : [this.pendingActionsButton, this.paymentsButton];
          this.startButtons = [];
          if (this.showPendingActions)
            this.pendingActionFactory.fetchPendingActions();
          this.summary = {};
          this.result = this.fillSuccessResult();
          window.scrollTo(0, 0);
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.endButtons = !this.showPendingActions ? [this.paymentsButton] : [this.pendingActionsButton, this.paymentsButton];
          this.startButtons = [];
          this.summary = {};
          this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
          window.scrollTo(0, 0);
        }
      })
  }

  buildSinglePaymentConfirmReq(requestValidate?: any): EsalPaymentConfirmReq {
    return {
      batchList: this.esalSinglePaymentValidateResponse.batchList,
      pending: false,
      sendMails: false,
      requestValidate: requestValidate
    }
  }

  buildSinglePaymentValidateReq(): EsalPaymentValidateReq {
    let esaliSingleInvoiceList = this.esalPaymnentListAgainstInvoice.listBatch.items
    esaliSingleInvoiceList[0].amountPayment = this.getControl(1, 0, "amount").value;
    esaliSingleInvoiceList[0].accountNumber = this.getControl(1, 0, "fromAccount").value.fullAccountNumber;
    return {
      batchList: esaliSingleInvoiceList,
      pending: false,
    }
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
        subTitle: 'public.total-amount',
        amount: this.getControl(1, 0, "amount").value,
        currency: 'SAR'
      },
      sections: [
        {
          title: {
            id: 'esalSinglePaymentTitle',
            title: this.getControl(1, 0, "billerIdAndNameTitle").controlOptions.title,
            subTitle: this.getControl(1, 0, "billerIdAndNameTitle").controlOptions.subTitle,
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: [
            {
              title: 'payments.esal.amount-to-pay',
              subTitle: this.getControl(1, 0, "amount").value,
            },
            {
              title: 'public.account',
              subTitle: this.getControl(1, 0, "fromAccount").value.fullAccountNumber
            },
            {
              title: 'payments.esal.to',
              subTitle: this.getControl(1, 0, "billerIdAndNameTitle").controlOptions.title,
            },
            {
              title: 'payments.esal.supplier-bank-name',
              subTitle: 'public.rajhiBank',
            },
            {
              title: 'payments.esal.amount-due',
              subTitle: this.getControl(1, 1, "amountDue").value,
            },
            {
              title: 'payments.esal.invoice-id',
              subTitle: this.getControl(1, 1, "invoiceId").value,
            },
            {
              title: 'payments.esal.supplier-id',
              subTitle: this.getControl(1, 1, "supplierId").value,
            },
            {
              title: 'payments.esal.buyer-name',
              subTitle: this.getControl(1, 1, "buyerName").value,
            },
            {
              title: 'payments.esal.due-date',
              subTitle: this.getControl(1, 1, "dueDate").value,
            },
            {
              title: 'payments.esal.additional-details',
              subTitle: this.getControl(1, 1, "additionalDetails").value,
            }
          ]
        }
      ]
    }
  }

  fillSuccessResult(): ResultModal {
    return {
      type: this.isPendingAuthorization() ? 'Pending' : 'Success',
      title: this.isPendingAuthorization() ? 'payments.aramco-payment.peandingAuthMessage' : 'payments.esal.invoice-paid',
      subTitle: "payments.esal.single-invoice",
      summary: this.fillSummary(false),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(false),
    };
  }

  showOtp() {
    this.otpService.showVerification(structuredClone(this.esalSinglePaymentValidateResponse.generateChallengeAndOTP)).subscribe((requestValidate: RequestValidate) => {
      this.confirmSinglePayment(requestValidate);
    });
  }

  isPendingAuthorization(): boolean {
    return this.esalSinglePaymentValidateResponse.batchList.toAuthorize ? this.esalSinglePaymentValidateResponse.batchList.toAuthorize.length > 0 : false;
  }
}
