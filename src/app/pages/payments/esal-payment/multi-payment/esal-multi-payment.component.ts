import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {ControlBase} from "app/@core/model/dto/control/control.model";
import {TableControl} from "app/@core/model/dto/control/table-control";
import {FormModel, FormResult, PageModel} from "app/@core/model/dto/formModel";
import {PopupOutputModel} from "app/@core/model/dto/popup.model";
import {ResultModal} from "app/@core/model/dto/result.modal";
import {RequestValidate} from "app/@core/model/rest/common/otp.model";
import {EsalPaymentConfirmReq} from "app/@core/model/rest/payments/esal-payment/esal-payment-confirm-req.model";
import {FetchEsalBatchReq} from "app/@core/model/rest/payments/esal-payment/esal-payment-item-fetching-req.model";
import {BatchItem, EsalPaymentItemRes} from "app/@core/model/rest/payments/esal-payment/esal-payment-item-res.model";
import {EsalPaymentValidateReq} from "app/@core/model/rest/payments/esal-payment/esal-payment-validate-req.model";
import {EsalPaymentValidateRes} from "app/@core/model/rest/payments/esal-payment/esal-payment-validate-res.model";
import {PopupService} from "app/@core/service/base/popup.service";
import {ResponseException} from "app/@core/service/base/responseException";
import {VerificationService} from "app/@core/service/base/verification.service";
import {EsalPaymentService} from "app/@core/service/payments/esal-payment/esal-payment.service";
import {UserProfileService} from "app/@core/service/user-profile/user-profile.service";
import {FormButtonClickOutput} from "app/shared/form/form.component";
import {ChipsModel} from "arb-design-library/model/chip.model";
import {PaginationValueModel} from "arb-design-library/model/pagination.model";
import {SummarySectionModel} from "arb-design-library/model/summary-section.model";
import {SummaryModel} from "arb-design-library/model/summary.model";
import {PaymentBaseComponent} from "../../payment-base/payment-base.component";
import {accountDetailsForm, esalPaymentOptions, payEsalForm} from "../esal-payment-comman-controls";
import {multiInvoicesForm, getSearchForm} from "./esal-multi-payment-controls";
import {Utils} from "../../../../@core/utility/Utils";
import {AuthenticationUtils} from "../../../../@core/utility/authentication-utils";

@Component({
  selector: 'app-esal-multi-payment',
  templateUrl: '../../payment-base/payment-base.component.html',
  styleUrls: []
})
export class EsalMultiPaymentComponent extends PaymentBaseComponent implements OnInit {

  esalInvoicesAgainstPayerId!: EsalPaymentItemRes;
  copyEsalInvoicesAgainstPayerId!: EsalPaymentItemRes;

  esalInvoicesValidateResponse!: EsalPaymentValidateRes;
  esalMultiInvoicesRequiredField!: any;
  searchForm: FormModel = getSearchForm();
  selectedInvoices: BatchItem[] = [];
  reqParams: FetchEsalBatchReq = {page: 1, rows: 10};
  pagingValueInfo: PaginationValueModel = {page: 1, size: 10};

  constructor(
    public override router: Router,
    private esalPaymentService: EsalPaymentService,
    private userProfileService: UserProfileService,
    private popupService: PopupService,
    private otpService: VerificationService) {
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
        text: 'payments.esal.pay-multi-invoice',
        url: ''
      }]);

    this.pageTitle.id = "esal-payment-main-page";
    this.pageTitle.showArrow = true;
    this.pageTitle.title = "payments.esal.title";
    this.pageTitle.endButtons = this.showPendingActions ? [this.analyticsButton, this.statementButton, this.approvalStatusButton] : [this.analyticsButton, this.statementButton]
    this.pageTitle.stepper!.steps = ["", "", "", ""];

    this.pages = [
      new PageModel(1, payEsalForm(), accountDetailsForm()),
      new PageModel(2, multiInvoicesForm())
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
    this.getControl(0, 0, "singleType").setValue({'key': 'multiInvoice', 'value': 'Multiple Invoice'});
    this.getControl(0, 0, "singleType").hidden = false;
    this.getControl(0, 0, "singleType").disable();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  drawEsalMultiInvoicesPage() {

    this.esalPaymentService.fetchEsalPayment(this.buildEsalPaymentRequestByInvoiceId(this.esalMultiInvoicesRequiredField['payerId'])).subscribe(
      {
        next: (res) => {

          this.stepperMoveNext();
          this.pageTitle.id = 'pay-multi-invoice';
          this.pageTitle.showArrow = false;
          this.pageTitle.title = 'payments.esal.pay-multi-invoice';
          this.pageTitle.endButtons = []

          this.getAndFillAccountList(this.getControl(1, 0, "fromAccount"), this.esalMultiInvoicesRequiredField['selectedAccount']);
          this.getControl(1, 0, "payerIdNumber").setValue(this.esalMultiInvoicesRequiredField['payerId']);

          //this.fatechAndSetEsalInvoicesTableDataSource(this.buildEsalPaymentRequestByInvoiceId(this.esalMultiInvoicesRequiredField['payerId']));

          this.esalInvoicesAgainstPayerId = res;
          this.copyEsalInvoicesAgainstPayerId = structuredClone(res);
          this.getControl(1, 0, "invoiceTable").controlOptions.data = this.esalInvoicesAgainstPayerId.listBatch.items;
          this.getControl(1, 0, "invoiceTable").controlOptions.total = this.esalInvoicesAgainstPayerId.listBatch.total;
          this.endButtons[0].showLoading = false;
          this.updateChips();
          this.startButtons = [this.backButton];
          this.endButtons = [this.nextButton];
        },
        error: (error: ResponseException) => {
          this.getControl(1, 0, "invoiceTable").controlOptions.data = [];
          console.error("Error while fetching esal payment against given payer id");
        }
      })


    //Registering table event listener start
    this.getControl(1, 0, "invoiceTable").valueChanges.subscribe(value => {
      this.selectedInvoices = value.value;
      this.updateChips();
    });

    (this.getControl(1, 0, "invoiceTable") as TableControl).externalPagination?.subscribe(
      (data: PaginationValueModel) => {
        this.handleTablePageChangeEvent(data);
      });
    (this.getControl(1, 0, "invoiceTable") as TableControl).onFilterClick?.subscribe(
      () => {
        this.openSearch();
      });
    //End

  }

  handleTablePageChangeEvent(data: PaginationValueModel) {
    this.endButtons[0].showLoading = true;
    this.pagingValueInfo = data;
    this.fatechAndSetEsalInvoicesTableDataSource(
      this.reqParams = this.buildEsalPaymentRequest(this.esalMultiInvoicesRequiredField['payerId']));
  }

  fatechAndSetEsalInvoicesTableDataSource(req: FetchEsalBatchReq) {
    this.esalPaymentService.fetchEsalPayment(req).subscribe(
      {
        next: (res) => {
          this.esalInvoicesAgainstPayerId = res;
          this.copyEsalInvoicesAgainstPayerId = structuredClone(res);
          this.getControl(1, 0, "invoiceTable").controlOptions.data = this.esalInvoicesAgainstPayerId.listBatch.items;
          this.getControl(1, 0, "invoiceTable").controlOptions.total = this.esalInvoicesAgainstPayerId.listBatch.total;
          this.endButtons[0].showLoading = false;
        },
        error: (error: ResponseException) => {
          this.getControl(1, 0, "invoiceTable").controlOptions.data = [];
          console.error("Error while fetching esal payment against given payer id");
        }
      })
  }

  buildEsalPaymentRequestByInvoiceId(payerId: string): FetchEsalBatchReq {
    return {
      page: this.pagingValueInfo.page,
      rows: this.pagingValueInfo.size,
      payerID: payerId,
    }
  }

  buildEsalPaymentRequest(payerId: string): FetchEsalBatchReq {
    return {
      page: this.pagingValueInfo.page,
      rows: this.pagingValueInfo.size,
      payerID: payerId,
      dueDateFrom: this.reqParams.dueDateFrom,
      dueDateTo: this.reqParams.dueDateTo,
      amountFrom: this.reqParams.amountFrom,
      amountTo: this.reqParams.amountTo,
      supplierName: this.reqParams.supplierName

    }
  }

  openSearch() {
    this.popupService.showPopup({image: '', form: this.searchForm}).subscribe((res: PopupOutputModel) => {
      if (res.buttonId == "search") {
        let reqParams = this.reqParams;

        res.controls!["suplierName"].value || res.controls!["suplierName"].value.trim() == '' ? reqParams.supplierName = res.controls!["suplierName"].value : null;
        res.controls!["fromDate"].value ? reqParams.dueDateFrom = this.convertNgbStructToString(res.controls!["fromDate"].value) : null;
        res.controls!["toDate"].value ? reqParams.dueDateTo = this.convertNgbStructToString(res.controls!["toDate"].value) : null;
        res.controls!["fromAmount"].value ? reqParams.amountFrom = res.controls!["fromAmount"].value : null;
        res.controls!["toAmount"].value ? reqParams.amountTo = res.controls!["toAmount"].value : null;
        this.getControl(1, 0, "invoiceTable").controlOptions.filterIsActive = true;
        this.reqParams = this.buildEsalPaymentRequest(this.esalMultiInvoicesRequiredField['payerId']);
        this.fatechAndSetEsalInvoicesTableDataSource(this.reqParams);
        this.popupService.dismiss();
      } else if (res.buttonId == "reset") {
        this.reqParams = this.buildEsalPaymentRequestByInvoiceId(this.esalMultiInvoicesRequiredField['payerId']);
        this.fatechAndSetEsalInvoicesTableDataSource(this.reqParams);
        this.getControl(1, 0, "invoiceTable").controlOptions.filterIsActive = false;
        this.popupService.dismiss();
      } else if (res.buttonId == 'close') {
        this.popupService.dismiss();
      }
    });
  }

  deleteChips(id: string) {
    const idx = this.selectedInvoices.findIndex(item => item.invoiceId == id);
    if (idx >= 0) {
      this.selectedInvoices.splice(idx, 1);
    }
    this.getControl(1, 0, "invoiceTable").setValue(this.selectedInvoices);
    this.esalInvoicesAgainstPayerId = structuredClone(this.copyEsalInvoicesAgainstPayerId);
    this.getControl(1, 0, "invoiceTable").controlOptions.data = this.esalInvoicesAgainstPayerId.listBatch.items;
    this.getControl(1, 0, "invoiceTable").controlOptions.total = this.esalInvoicesAgainstPayerId.listBatch.total;
    this.updateChips();
  }

  convertNgbStructToString(value: NgbDateStruct): string {
    let transformDate;
    if (value) {
      transformDate = value.year + "-" + value.month + "-" + value.day
    }
    return transformDate ? transformDate : "";
  }

  updateChips() {
    let chips: ChipsModel[] = [];
    this.selectedInvoices.forEach(item => {
      chips.push({id: item.invoiceId, label: item.invoiceId, showClose: true});
    });
    this.getControl(1, 0, "selectedCountTitle").controlOptions.chips = chips;
    this.getControl(1, 0, "selectedCountTitle").controlOptions.title =
      this.translate.instant("payments.esal.selected-invoices", {"0": this.selectedInvoices.length});
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
      control.hidden = false;
    })
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput): void {
    console.log(formButtonClickOutput.buttonId);
    switch (formButtonClickOutput.buttonId) {
      case 'Proceed':
        this.nextClick();
        break;
      case 'Next':
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
      default:
        this.deleteChips(formButtonClickOutput.buttonId);
        break;
    }
  }

  navigateToEsalMultiInvoicesPage() {
    let payerId = this.getControl(0, 0, "payerIdNumber").value ? this.getControl(0, 0, "payerIdNumber").value : null;
    let selectedAccount = this.getControl(0, 1, "fromAccount").value.fullAccountNumber;
    this.esalMultiInvoicesRequiredField = {"payerId": payerId, "selectedAccount": selectedAccount};
    this.drawEsalMultiInvoicesPage();
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.navigateToEsalMultiInvoicesPage();
        break;
      case 2:
        this.validatePayment();
        break;
      case 3:
        this.esalInvoicesValidateResponse.batchList.toProcess.length > 0 ? this.showOtp() : this.confirmPayment();
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
        this.pageTitle.title = 'payments.esal.pay-multi-invoice';
        this.endButtons[0].isDisable = false;
        this.stepperMoveBack();
        break;
    }
  }

  validatePayment() {
    this.esalPaymentService.validateEsalPayment(this.buildSelctedPaymentValidateReq()).subscribe(
      {
        next: (res) => {
          if (!res.errors) {
            this.stepperMoveNext();
            this.esalInvoicesValidateResponse = res;
            this.endButtons = [this.nextButton];
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

  confirmPayment(requestValidate?: RequestValidate) {
    this.esalPaymentService.confirmEsalPayment(this.buildPaymentConfirmReq(requestValidate)).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.endButtons = !this.showPendingActions ? [this.paymentsButton] : [this.pendingActionsButton, this.paymentsButton];
          this.startButtons = [];
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

  buildPaymentConfirmReq(requestValidate?: any): EsalPaymentConfirmReq {
    return {
      batchList: this.esalInvoicesValidateResponse.batchList,
      pending: false,
      sendMails: false,
      requestValidate: requestValidate
    }
  }

  resetDueAmountValueFromResponse() {
    this.selectedInvoices.forEach(selectedItem => {
      this.copyEsalInvoicesAgainstPayerId.listBatch.items.forEach(item => {
        if (item.invoiceId === selectedItem.invoiceId) {
          selectedItem.amountPayment = selectedItem.amountDue;
          selectedItem.amountDue = item.amountDue;
          selectedItem.accountNumber = this.getControl(1, 0, "fromAccount").value.fullAccountNumber;
        }
      })
    })
  }

  buildSelctedPaymentValidateReq(): EsalPaymentValidateReq {
    this.resetDueAmountValueFromResponse();
    return {
      batchList: this.selectedInvoices,
      pending: false,
    }
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    let sections: SummarySectionModel[] = [];
    let totalAmount = 0;
    this.selectedInvoices.forEach((item, index) => {
      totalAmount += parseFloat(item.amountPayment);
      sections.push(
        {
          title: {
            id: 'esalPaymentTitle' + (index + 1),
            title: item.billerName,
            subTitle: this.translate.instant('payments.esal.invoice-number') + " " + item.invoiceId,
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: [
            {
              title: 'public.account',
              subTitle: this.getControl(1, 0, "fromAccount").value.alias + ' ' +
                this.getControl(1, 0, "fromAccount").value.fullAccountNumber,
              currency: "608",
            },
            {
              title: 'payments.esal.amount-due',
              subTitle: item.amountDue,
            },
            {
              title: 'payments.esal.invoice-id',
              subTitle: item.invoiceId,
            },
            {
              title: 'payments.esal.supplier-id',
              subTitle: item.billerId,
            },
            {
              title: 'payments.esal.buyer-name',
              subTitle: item.buyerName,
            },
            {
              title: 'payments.esal.due-date',
              subTitle: item.dateDue,
            },
            {
              title: 'payments.esal.additional-details',
              subTitle: item.additionalDetails,
            }
          ]
        });
    });
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
        subTitle: 'public.total-amount',
        amount: totalAmount.toString(),
        currency: 'SAR'
      },
      sections: sections
    }
  }

  fillSuccessResult(): ResultModal {
    return {
      type: this.isPendingAuthorization() ? 'Pending' : 'Success',
      title: this.isPendingAuthorization() ? 'payments.aramco-payment.peandingAuthMessage' : 'payments.esal.invoice-paid',
      subTitle: "payments.esal.multi-invoice",
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
    this.otpService.showVerification(structuredClone(this.esalInvoicesValidateResponse.generateChallengeAndOTP)).subscribe((requestValidate: RequestValidate) => {
      this.confirmPayment(requestValidate);
    });
  }

  isPendingAuthorization(): boolean {
    return this.esalInvoicesValidateResponse.batchList.toAuthorize ? this.esalInvoicesValidateResponse.batchList.toAuthorize.length > 0 : false;
  }

}
