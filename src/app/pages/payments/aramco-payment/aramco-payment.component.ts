import {Component, OnInit} from '@angular/core';
import {AccountControl} from 'app/@core/model/dto/control/account-control';
import {AmountControl} from 'app/@core/model/dto/control/amount-control';
import {PillControl} from 'app/@core/model/dto/control/pill-control';
import {SummaryItemControl} from 'app/@core/model/dto/control/sumery-item-control';
import {TableControl} from 'app/@core/model/dto/control/table-control';
import {TitleControl} from 'app/@core/model/dto/control/title-control';
import {FormModel, FormResult, PageModel} from 'app/@core/model/dto/formModel';
import {ResultModal} from 'app/@core/model/dto/result.modal';
import {SummaryModel} from "arb-design-library/model/summary.model";
import {BatchList} from 'app/@core/model/rest/common/batchResponse';
import {RequestValidate} from 'app/@core/model/rest/common/otp.model';
import {BeneficiariesReqModel} from 'app/@core/model/rest/payments/aramco-payment/beneficiaries-req';
import {BeneficiaryItem} from 'app/@core/model/rest/payments/aramco-payment/beneficiaries-res';
import {ConfirmReqModel} from 'app/@core/model/rest/payments/aramco-payment/confirm-req.model';
import {AramcoPaymentItem, ValidateReqModel} from 'app/@core/model/rest/payments/aramco-payment/validate-req.model';
import {
  AramcoBatchList,
  AramcoBatchToAuthorize,
  ValidateResModel
} from 'app/@core/model/rest/payments/aramco-payment/validate-res.model';
import {ModelAndListService} from 'app/@core/service/base/modelAndList.service';
import {ResponseException} from 'app/@core/service/base/responseException';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {AramcoPaymentService} from 'app/@core/service/payments/aramco-payments/aramco-payment.service';
import {PaginationValueModel} from 'arb-design-library/model/pagination.model';
import {SummarySectionModel} from 'arb-design-library/model/summary-section.model';
import {PaymentBaseComponent} from "../payment-base/payment-base.component";
import {
  amountControl,
  beneficiaryNameTitle,
  fromAccountControl,
  paymentDetailTitle,
  pillControl,
  selectBeneficiariesForm,
  summaryControl
} from './aramco-payment-control';
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {Utils} from "../../../@core/utility/Utils";
import {PendingActionFactory} from 'app/@core/service/base/pending-action-factory.service';

@Component({
  selector: 'app-aramco-payment',
  templateUrl: '../payment-base/payment-base.component.html',
  styleUrls: []
})
export class AramcoPaymentComponent extends PaymentBaseComponent implements OnInit {

  validatedResponse!: ValidateResModel;
  beneficiariesReq!: BeneficiariesReqModel;
  selectedBeneficiaries: BeneficiaryItem[] = [];

  constructor(private otpService: VerificationService,
              private modelAndListService: ModelAndListService,
              private pendingActionFactory: PendingActionFactory,
              private aramcoPaymentService: AramcoPaymentService) {

    super();
    this.setBreadcrumb([
      {
        text: "payments.name",
        url: '/payments'
      },
      {
        text: "payments.aramco-payment.title",
        url: '/payments/aramco-payment'
      }
    ]);

    this.pageTitle.id = "AramcoBeneficiaryTitle";
    this.pageTitle.title = "payments.aramco-payment.title";
    this.pageTitle.stepper!.steps = ["", "", "", ""];
    this.pageTitle.endButtons = [];
    this.endButtons[0].showLoading = true;
    this.pages = [new PageModel(1, selectBeneficiariesForm(this.translate))];
    this.buildBeneficiaryTablePageModel();
    this.fatechAndSetBeneficiaryTableDataSource();
    this.registerBeneficiaryTableEventListeners();
  }

  override ngOnInit(): void {
  }

  buildBeneficiaryTablePageModel(options: BeneficiariesReqModel = {}) {
    this.beneficiariesReq = {
      page: options.page || 1,
      rows: options.rows || 20,
    };
  }

  fatechAndSetBeneficiaryTableDataSource() {
    this.aramcoPaymentService.getBeneficiaryList(this.beneficiariesReq).subscribe({
      next: data => {
        this.getControl(0, 0, "beneficiariesTable").controlOptions.data = data.listBeneficiary.items;
        this.getControl(0, 0, "beneficiariesTable").controlOptions.total = data.listBeneficiary.total;
        this.endButtons[0].showLoading = false;
      }, error: () => {
        this.getControl(0, 0, "beneficiariesTable").controlOptions.data = [];
      }
    });
  }

  registerBeneficiaryTableEventListeners() {
    //Register beneficiary table page change event listener
    (this.getControl(0, 0, "beneficiariesTable") as TableControl).externalPagination?.subscribe(
      (data: PaginationValueModel) => {
        this.handleTablePageChangeEvent(data);
      });

    //Register beneficiary table value change event listener
    this.getControl(0, 0, "beneficiariesTable").valueChanges.subscribe(value => {
      this.selectedBeneficiaries = value.value;
      this.selectedBeneficiaries.slice(0, 1);
      this.endButtons[0].isDisable = this.selectedBeneficiaries.length <= 0;
    });
  }

  handleTablePageChangeEvent(data: PaginationValueModel) {
    this.endButtons[0].showLoading = true;
    this.buildBeneficiaryTablePageModel({page: data.page, rows: data.size});
    this.fatechAndSetBeneficiaryTableDataSource();
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.handleClickEventWRTSetp();
        break;
      case 'Confirm':
        this.handleClickEventWRTSetp();
        break;
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'Payments':
        this.router.navigateByUrl('/payments');
        break;
      case 'PendingActions':
        this.setBreadcrumb([]);
        void this.router.navigate(['/pendingActions/pending-actions-list'])
        break;
    }
  }

  handleClickEventWRTSetp() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.fillBeneficiaries();
        break;
      case 2:
        this.validateAramcoPayments();
        break;
      case 3:
        this.validatedResponse.aramcoBatchList.toProcess.length > 0 ? this.showOtp() : this.confirmAramcoPayments();
        break;
    }
  }

  fillBeneficiaries() {
    this.drawPages();
  }

  drawPages() {
    if (this.pages[1]) {
      this.pages[1].deleteFrom(0, this.pages[1].forms.length);
      this.pages.splice(1, 1);
    }
    let page: PageModel = new PageModel(2);
    console.log(this.selectedBeneficiaries);
    this.selectedBeneficiaries.forEach((item, index) => {
      let form = new FormModel({
        id: 'formForPayment-' + (index + 1),
        showDivider: true,
        controls: {
          "paymentTitle": new TitleControl(structuredClone(paymentDetailTitle)),
          "fromAccountControl": new AccountControl(structuredClone(fromAccountControl)),
          "amountControl": new AmountControl(structuredClone(amountControl)),
          "pillControl": new PillControl(structuredClone(pillControl)),
          "beneficiaryNameTitle": new TitleControl(structuredClone(beneficiaryNameTitle)),
          "customerIdSummaryControl": new SummaryItemControl(structuredClone(summaryControl))
        },
      });
      form.controls["pillControl"].controlOptions.text = this.translate.instant("payments.aramco-payment.title") + " #" + (index + 1);
      form.controls["paymentTitle"].controlOptions.title = "payments.payment-details";
      form.controls["beneficiaryNameTitle"].controlOptions.title = item.customerName;
      form.controls["customerIdSummaryControl"].label = "payments.aramco-payment.tableHeader.aramcoPassNumber";
      form.controls["customerIdSummaryControl"].setValue(item.customerId);
      page.addForm(form);
    });
    this.fetchInitiateAccounts();
    this.pages.push(page);
    this.stepperMoveNext();
    this.endButtons[0].showLoading = false;
    this.endButtons[0].isDisable = false;
  }

  fetchInitiateAccounts() {
    this.endButtons[0].showLoading = true;
    this.aramcoPaymentService.getAccountList().subscribe((res) => {
      this.pages[1].forms.forEach((item) => {
        item.controls['fromAccountControl'].controlOptions.options = res.listInitiateAccount;
      });
    })
    this.endButtons[0].showLoading = false;
  }

  validateAramcoPayments() {
    this.endButtons[0].showLoading = true;
    this.aramcoPaymentService.validateAramcoPayment(this.buildValidateRequestModel()).subscribe({
      next: (res) => {
        this.validatedResponse = res;
        this.summary = this.fillSummary();
        this.stepperMoveNext();
        this.endButtons = [this.confirmButton];
        this.endButtons[0].showLoading = false;
      },
      error: () => {
        this.endButtons[0].showLoading = false;
      }
    });
  }

  buildValidateRequestModel(): ValidateReqModel {
    let listAramcoPayment: AramcoPaymentItem[] = [];
    this.pages[1].forms.forEach((item) => {

      let beneficiaryItem: BeneficiaryItem = {
        customerId: item.controls['customerIdSummaryControl'].value,
        customerName: item.controls['beneficiaryNameTitle'].controlOptions.title,
      }
      let aramcoPaymentItem: AramcoPaymentItem = {
        accountNumber: item.controls['fromAccountControl'].value.fullAccountNumber,
        amount: item.controls['amountControl'].value.toString(),
        aramcoBeneficiary: beneficiaryItem
      }
      listAramcoPayment.push(aramcoPaymentItem);
    });

    return {
      listPayments: listAramcoPayment
    }
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    let sections: SummarySectionModel[] = [];
    let totalAmount = 0;

    let res = [];
    res.push(...this.validatedResponse.aramcoBatchList.toAuthorize ? this.validatedResponse.aramcoBatchList.toAuthorize : []);
    res.push(...this.validatedResponse.aramcoBatchList.toProcess);

    res.forEach((item: AramcoBatchToAuthorize, index: number) => {
      let accountNumber = item.accountNumber;
      let accountIsNotAllowed = this.verifyAccountIsNotAllowed(this.validatedResponse.aramcoBatchList, accountNumber)

      if (!accountIsNotAllowed) {
        totalAmount += Number(item.amount!);
      }

      sections.push(
        {
          pill: {
            text: accountIsNotAllowed ?
              this.translate.instant("payments.aramco-payment.title") + ' #' + (index + 1) + ' ' + this.translate.instant("payments.not-allowed") :
              this.translate.instant("payments.aramco-payment.title") + ' #' + (index + 1),
            type: accountIsNotAllowed ? 'Negative' : 'Positive'
          },
          title: {
            id: 'transferDetailsTitle' + (index + 1),
            title: this.selectedBeneficiaries[index].customerName,
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: [
            {
              title: 'public.from',
              subTitle: Utils.getAccountAndAlias(this.getControl(1, 0, 'fromAccountControl').controlOptions.options, accountNumber),
            },
            {
              title: 'public.amount',
              subTitle: item.amount!.toString(),
              currency: "608",
            },
            {
              title: "payments.aramco-payment.tableHeader.aramcoPassNumber",
              subTitle: item.passNumber
            },
            Utils.getCurrentLevelSummaryItem(this.translate, item.futureSecurityLevelsDTOList),
            Utils.getNextLevelSummaryItem(this.translate, item.futureSecurityLevelsDTOList)

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

  verifyAccountIsNotAllowed(batch: AramcoBatchList, accountNumber: string): boolean {
    if (batch.notAllowed.length > 0) {
      let matchedElement = batch.notAllowed.filter(data => data.accountNumber === accountNumber)
      return matchedElement.length > 0;
    }
    return false;
  }


  showOtp() {
    this.otpService.showVerification(structuredClone(this.validatedResponse.generateChallengeAndOTP)).subscribe((requestValidate: RequestValidate) => {
      this.confirmAramcoPayments(requestValidate);
    });
  }

  buildAramcoPaymentConfirmRequest(otp: RequestValidate = {}): ConfirmReqModel {
    return {
      aramcoBatchList: this.validatedResponse.aramcoBatchList,
      requestValidate: otp
    }
  }

  confirmAramcoPayments(otp?: RequestValidate) {
    this.aramcoPaymentService.confirmAramcoPayment(this.buildAramcoPaymentConfirmRequest(otp)).subscribe(
      {
        next: () => {
          this.stepperMoveNext();
          this.endButtons = !this.showPendingActions ? [this.paymentsButton] : [this.pendingActionsButton, this.paymentsButton];
          this.startButtons = [];
          this.summary = {};
          this.result = this.fillSuccessResult();
          this.pendingActionFactory.fetchPendingActions();
        },
        error: (error: ResponseException) => {
          this.endButtons = !this.showPendingActions ? [this.paymentsButton] : [this.pendingActionsButton, this.paymentsButton];
          this.startButtons = [];
          this.summary = {};
          this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
        }
      });
  }

  fillSuccessResult(): ResultModal {
    return {
      type: this.isPendingAuthorization() ? 'Pending' : 'Success',
      title: this.isPendingAuthorization() ? 'payments.aramco-payment.peandingAuthMessage' : 'payments.aramco-payment.paymentSucessful',
      subTitle: 'payments.aramco-payment.title',
      summary: this.fillSummary(false),
    };
  }

  isPendingAuthorization(): boolean {
    return this.validatedResponse.aramcoBatchList.toAuthorize?.length != undefined;
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(false),
    };
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['/payments']);
        break;
      case 2:
        this.stepperMoveBack();
        void this.router.navigate(['/payments/aramco-payment']);
        break;
      case 3:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton];
        this.endButtons[0].showLoading = false;
        this.endButtons[0].isDisable = false;
        break;
    }
  }

}
