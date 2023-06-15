import { Component, OnInit } from '@angular/core';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { AccountsReq } from 'app/@core/model/rest/accounts/accounts-req';
import { GenerateChallengeAndOTP, RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { BillPayConfirmReq } from 'app/@core/model/rest/payments/billPayment/bill-pay-confirm-req';
import { BillPaymentValidateReq } from 'app/@core/model/rest/payments/billPayment/bill-payment-validate-req';
import {
  BillPaymentValidateRes
} from 'app/@core/model/rest/payments/billPayment/bill-payment-validate-res';
import { AccountsCommonService } from 'app/@core/service/accounts/accounts-common.service';
import { ResponseException } from 'app/@core/service/base/responseException';
import { VerificationService } from 'app/@core/service/base/verification.service';
import {
  OneTimeBillPaymentService
} from 'app/@core/service/payments/bill-payments/one-time-bill-payment/one-time-bill-payment.service';
import { Utils } from 'app/@core/utility/Utils';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { SummaryItemModel } from 'arb-design-library/model/summary-item.model';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { PaymentBaseComponent } from "../payment-base/payment-base.component";
import {
  getEndButtons, getOneTimePaymentTypeAndaAmountForm, getOneTimePaymentTypeForm
} from './one-time-payment-controls.component';

@Component({
  selector: 'app-one-time-payment',
  templateUrl: '../payment-base/payment-base.component.html',
  styleUrls: []
})
export class OneTimePaymentComponent extends PaymentBaseComponent implements OnInit {

  accountsList!: AccountsReq;
  validateBillPaymenmt!: BillPaymentValidateReq;
  responseValidateBillPayment!: BillPaymentValidateRes;
  selectedBills: any[] = []
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  oneTimePaymentTypeAndaAmountForm = getOneTimePaymentTypeAndaAmountForm();
  selectedAccount: any;
  private selectedBillCode: any;

  constructor(
    private accountsCommonService: AccountsCommonService,
    private otpService: VerificationService,
    private oneTimeBillPaymentService: OneTimeBillPaymentService,
  ) {
    super();

    this.setBreadcrumb([
      {
        text: "payments.name",
        url: '/payments'
      },
      {
        text: "payments.oneTimeBillPayment.title",
        url: '/payments/one-time-bill-payment'
      }
    ]);

    this.pageTitle.id = "OneTimeBillPaymentTitle";
    this.pageTitle.title = "payments.oneTimeBillPayment.title";
    this.pageTitle.stepper!.steps = ["", "", "", ""];
    this.pageTitle.endButtons = [];
    this.pageTitle.showArrow = true;
    this.endButtons[0].showLoading = false;
    this.pages = [
      new PageModel(1, getOneTimePaymentTypeForm()),
      new PageModel(2, this.oneTimePaymentTypeAndaAmountForm)
    ];

  }

  override ngOnInit(): void {
    this.getServicesInit();
  }


  getServicesInit() {
    this.oneTimeBillPaymentService.getBillCodes().subscribe(res => {
      let billsList = res.billCodesList.billsList;
      let options: any[] = [];
      Object.keys(billsList).forEach((key) => {
        options.push({
          id: billsList[key].billCode,
          value: billsList[key].detailsDescriptionEn,
          displayText: billsList[key].detailsDescriptionEn,
          billCode: billsList[key].billCode
        });
      });
      this.getControl(0, 0, "serviceProvider").controlOptions.options = options;
    })

    this.accountsCommonService.getSarAccounts().subscribe(res => {
      this.getControl(0, 0, "selectAccount").controlOptions.options = res.listAlertsPermissionAccount;
      this.getControl(0, 0, "selectAccount").setValue(res.listAlertsPermissionAccount[0]);
      if (history.state.billRef) {
        const bill = history.state;
        const category = this.getControl(0, 0, "serviceProvider").controlOptions.options.filter((item: any) => item.billCode == bill.billCode)[0];
        this.getControl(0, 0, "serviceProvider").setValue(category);
        this.getControl(0, 0, "subscriptionNumber").setValue(bill.billRef);
        this.endButtons[0].isDisable = false;
        this.nextClick();
      }
    })

  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick()
        break;
      case 'Confirm':
        this.nextClick()
        break;
      case 'Edit':
        break;
      case 'Payments':
        break;
      case 'Back':
        this.backClick()
        break;
      case "goToDashboard":
        this.router.navigate(['/dashboard']).then();
        break;
      case "goToPayAnotherBills":
        this.router.navigate(['/payments']);
        break;
      case "arrowTitle":
        this.pageTitle.stepper!.stepCounter > 1 ? this.backClick() : this.router.navigate(['/payments']);
        break;
    }
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.nextOneTimeBillPayment(true);
        break;
      case 2:
        this.nextOneTimeBillPayment(false);
        break;
      case 3:
        this.generateChallengeAndOTP ? this.showOtp() : this.confirm();
        break;
    }
  }

  showOtp() {
    this.otpService.showVerification(this.responseValidateBillPayment.generateChallengeAndOTP).subscribe((requestValidate: RequestValidate) => {
      this.confirm(requestValidate);
    });
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['/payments']);
        break;
      case 2:
        this.stepperMoveBack();
        break;
      case 3:
        this.stepperMoveBack();
        break;
      case 4:
        this.stepperMoveBack();
        break;
    }
  }

  override onResultChanged(form: FormResult[]) {
    this.endButtons[0].isDisable = !form[0].valid
  }

  getConvertDate(date: string | number | Date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    const newDate: any = {
      year: year,
      month: month,
      day: day
    }
    return Utils.getDateFormatted(newDate, 'yyyy-MM-dd');
  }


  nextOneTimeBillPayment(inquiry: boolean) {
    if (inquiry) {
      this.selectedAccount = this.getControl(0, 0, "selectAccount").value
      this.selectedBillCode = this.getControl(0, 0, "serviceProvider").value.billCode
    }
    const dueDate = this.getConvertDate(new Date());
    let controlServiceProvider = (inquiry) ?
      this.getControl(0, 0, "serviceProvider").value
      : this.oneTimePaymentTypeAndaAmountForm.controls["billProvider"];
    let controlSubscriptionNumber = (inquiry) ?
      this.getControl(0, 0, "subscriptionNumber").value
      : this.oneTimePaymentTypeAndaAmountForm.controls["billNumber"].value;
    let controlSelectAccount = (inquiry) ?
      this.getControl(0, 0, "selectAccount").value
      : this.selectedAccount;
    this.validateBillPaymenmt = {
      accountNumber: controlSelectAccount.fullAccountNumber,
      emailChecked: '0',
      billSelected: [{
        billCodeSelected: this.selectedBillCode,
        amountPaid: (inquiry) ? 1 : this.oneTimePaymentTypeAndaAmountForm.controls["amount"].value,
        billReference: controlSubscriptionNumber,
        dueDate: dueDate,
        nickName: ""
      }]
    }
    this.oneTimeBillPaymentService.validatePayBill(this.validateBillPaymenmt, inquiry).subscribe({
      next: res => {
        let bill = res.batchListsContainer.toProcess.length ? res.batchListsContainer.toProcess[0] : res.batchListsContainer.toAuthorize ? res.batchListsContainer.toAuthorize[0] : undefined;
        if (bill) {
          this.oneTimePaymentTypeAndaAmountForm.controls["billProvider"].setValue(controlServiceProvider.value);
          this.oneTimePaymentTypeAndaAmountForm.controls["billNumber"].setValue(controlSubscriptionNumber);
          this.oneTimePaymentTypeAndaAmountForm.controls["billAmount"].setValue(bill.amountOriginal);
          this.oneTimePaymentTypeAndaAmountForm.controls["amount"].setValue(bill.amountOriginal);
          if (!inquiry) {
            this.generateChallengeAndOTP = res.generateChallengeAndOTP;
            this.responseValidateBillPayment = {
              batchListsContainer: res.batchListsContainer,
              generateChallengeAndOTP: res.generateChallengeAndOTP,
              refusedBatchList: res.refusedBatchList,
              total: res.total
            }
            this.summary = this.fillSummary();
            this.stepperMoveNext();
            this.endButtons = [this.confirmButton];
          } else {
            this.stepperMoveNext();
          }
        }
      }
    })
  }


  returnConfirmRequest(requestValidate?: RequestValidate): BillPayConfirmReq {
    return {
      batchListsContainer: this.responseValidateBillPayment.batchListsContainer,
      requestValidate: requestValidate
    }
  }

  confirm(requestValidate?: RequestValidate) {
    this.oneTimeBillPaymentService.confirmPayBill(this.returnConfirmRequest(requestValidate)).subscribe({
      next: () => {
        this.result = this.fillSuccessResult();
        this.stepperMoveNext();
        this.endButtons = getEndButtons();
        this.startButtons = [];
      },
      error: (error: ResponseException) => {
        this.result = this.fillErrorResult(error['ErrorResponse']['errorDescription']);
        this.stepperMoveNext();
        this.endButtons = [this.confirmButton];
      }
    });
  }

  fillSuccessResult(): ResultModal {
    return {
      type: this.responseValidateBillPayment.batchListsContainer.toAuthorize?.length ? 'Pending' : 'Success',
      title: this.responseValidateBillPayment.batchListsContainer.toAuthorize?.length ? 'payments.aramco-payment.peandingAuthMessage' : "payments.oneTimeBillPayment.success",
      summary: this.fillSummary(),
    };
  }


  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary()
    };
  }


  fillSummary(): SummaryModel {


    let summary: any;

    summary = {
      title: {
        id: 'summaryId',
        title: 'public.summary',
        subTitle: this.responseValidateBillPayment.batchListsContainer.toProcess.length > 0 ? 'payments.oneTimeBillPayment.toProcess' : (this.responseValidateBillPayment.batchListsContainer.toAuthorize?.length ? 'payments.oneTimeBillPayment.toAuthorize' : 'payments.oneTimeBillPayment.notAllowed')
      },
      sections: [{
        title: {
          id: 'amountDetaillsSummary',
          title: 'payments.oneTimeBillPayment.amountDetaillsSummary',


        },
        items: this.getSummaryItems('amountDetaillsSummary')
      },
        {
          title: {
            id: 'BillDetails',
            title: 'payments.oneTimeBillPayment.BillDetails',

          },
          items: this.getSummaryItems('BillDetails')
        },
        {
          title: {
            id: 'authorizationLevelInformation',
            title: 'payments.oneTimeBillPayment.authorizationLevelInformation',


          },
          items: this.getSummaryItems('authorizationLevelInformation')
        }
      ]
    }

    return summary;
  }

  getSummaryItems(section?: string): SummaryItemModel[] | null {
    let items: any;

    switch (section) {
      case 'amountDetaillsSummary':
        if (this.responseValidateBillPayment.batchListsContainer.toProcess.length > 0) {
          items = [
            {
              title: 'payments.oneTimeBillPayment.amount',
              subTitle: this.responseValidateBillPayment.batchListsContainer.toProcess[0]['amountPayment'],
              controlOptions: {currency: 'currency'}
            },
            {
              title: 'payments.oneTimeBillPayment.VAT',
              subTitle: this.responseValidateBillPayment.batchListsContainer.toProcess[0]['vatAmount'] ? this.responseValidateBillPayment.batchListsContainer.toProcess[0]['vatAmount'] : "0.00",
              controlOptions: {currency: 'currency'}
            }
          ];
        }
        if (this.responseValidateBillPayment.batchListsContainer.toAuthorize?.length) {
          items = [
            {
              title: 'payments.oneTimeBillPayment.amount',
              subTitle: this.responseValidateBillPayment.batchListsContainer.toAuthorize[0]['amountPayment'],
              controlOptions: {currency: 'currency'}
            },
            {
              title: 'payments.oneTimeBillPayment.VAT',
              subTitle: this.responseValidateBillPayment.batchListsContainer.toAuthorize[0]['vatAmount'] ? this.responseValidateBillPayment.batchListsContainer.toAuthorize[0]['vatAmount'] : "0.00",
              controlOptions: {currency: 'currency'}
            }
          ];
        }
        if (this.responseValidateBillPayment.batchListsContainer.notAllowed.length > 0) {
          items = [
            {
              title: 'payments.oneTimeBillPayment.amount',
              subTitle: this.responseValidateBillPayment.batchListsContainer.notAllowed[0]['amountPayment'],
              controlOptions: {currency: 'currency'}
            },
            {
              title: 'payments.oneTimeBillPayment.VAT',
              subTitle: this.responseValidateBillPayment.batchListsContainer.notAllowed[0]['vatAmount'] ? this.responseValidateBillPayment.batchListsContainer.notAllowed[0]['vatAmount'] : "0.00",
              controlOptions: {currency: 'currency'}
            }
          ];
        }
        break;
      case 'BillDetails':
        if (this.responseValidateBillPayment.batchListsContainer.toProcess.length > 0) {
          items = [
            {
              title: 'payments.oneTimeBillPayment.billProvider',
              subTitle: this.translate.currentLang === 'ar' ? this.responseValidateBillPayment.batchListsContainer.toProcess[0]['addDescriptionAr'] : this.responseValidateBillPayment.batchListsContainer.toProcess[0]['addDescriptionEn'],
              controlOptions: {currency: 'currency'}
            },
            {
              title: 'payments.oneTimeBillPayment.billNumber',
              subTitle: this.oneTimePaymentTypeAndaAmountForm.controls["billNumber"].value,
              controlOptions: {currency: 'currency'}
            },
            {
              title: 'payments.oneTimeBillPayment.billAmount',
              subTitle: this.oneTimePaymentTypeAndaAmountForm.controls["billAmount"].value,
              controlOptions: {currency: 'currency'}
            }
          ];
        }
        if (this.responseValidateBillPayment.batchListsContainer.toAuthorize?.length) {
          items = [
            {
              title: 'payments.oneTimeBillPayment.billProvider',
              subTitle: this.translate.currentLang === 'ar' ? this.responseValidateBillPayment.batchListsContainer.toAuthorize[0]['addDescriptionAr'] : this.responseValidateBillPayment.batchListsContainer.toAuthorize[0]['addDescriptionEn'],
              controlOptions: {currency: 'currency'}
            },
            {
              title: 'payments.oneTimeBillPayment.billNumber',
              subTitle: this.oneTimePaymentTypeAndaAmountForm.controls["billNumber"].value,
              controlOptions: {currency: 'currency'}
            },
            {
              title: 'payments.oneTimeBillPayment.billAmount',
              subTitle: this.oneTimePaymentTypeAndaAmountForm.controls["billAmount"].value,
              controlOptions: {currency: 'currency'}
            }
          ];
        }
        if (this.responseValidateBillPayment.batchListsContainer.notAllowed.length > 0) {
          items = [
            {
              title: 'payments.oneTimeBillPayment.billProvider',
              subTitle: this.translate.currentLang === 'ar' ? this.responseValidateBillPayment.batchListsContainer.notAllowed[0]['addDescriptionAr'] : this.responseValidateBillPayment.batchListsContainer.notAllowed[0]['addDescriptionEn'],
              controlOptions: {currency: 'currency'}
            },
            {
              title: 'payments.oneTimeBillPayment.billNumber',
              subTitle: this.oneTimePaymentTypeAndaAmountForm.controls["billNumber"].value,
              controlOptions: {currency: 'currency'}
            },
            {
              title: 'payments.oneTimeBillPayment.billAmount',
              subTitle: this.oneTimePaymentTypeAndaAmountForm.controls["billAmount"].value,
              controlOptions: {currency: 'currency'}
            }
          ];
        }
        break;
      case 'authorizationLevelInformation':
        items = []

        if (this.responseValidateBillPayment.batchListsContainer.toProcess.length > 0) {
          items.push(Utils.getCurrentLevelSummaryItem(this.translate,
            this.responseValidateBillPayment.batchListsContainer?.toProcess[0]?.futureSecurityLevelsDTOList))
          items[0].title = 'payments.oneTimeBillPayment.userLevel'
          items.push({
            title: 'payments.oneTimeBillPayment.status',
            subTitle: this.getStatus(this.responseValidateBillPayment.batchListsContainer?.toProcess[0]?.futureSecurityLevelsDTOList.find(value => value.level === +items[0].subTitle.substring(6))?.status!),
          })
          items.push({
            title: 'payments.oneTimeBillPayment.userId',
            subTitle: this.responseValidateBillPayment.batchListsContainer?.toProcess[0]?.futureSecurityLevelsDTOList.find(value => value.level === +items[0].subTitle.substring(6))?.updater!
          })
          items.push({
            title: 'payments.oneTimeBillPayment.dateTime',
            subTitle: this.responseValidateBillPayment.batchListsContainer?.toProcess[0]?.dueDate
          })
        }
        if (this.responseValidateBillPayment.batchListsContainer.toAuthorize?.length) {
          items.push(Utils.getCurrentLevelSummaryItem(this.translate,
            this.responseValidateBillPayment.batchListsContainer?.toAuthorize[0]?.futureSecurityLevelsDTOList))
          items[0].title = 'payments.oneTimeBillPayment.userLevel'
          items.push({
            title: 'payments.oneTimeBillPayment.status',
            subTitle: this.getStatus(this.responseValidateBillPayment.batchListsContainer?.toAuthorize[0]?.futureSecurityLevelsDTOList.find(value => value.level === +items[0].subTitle.substring(6))?.status!),
          })
          items.push({
            title: 'payments.oneTimeBillPayment.userId',
            subTitle: this.responseValidateBillPayment.batchListsContainer?.toAuthorize[0]?.futureSecurityLevelsDTOList.find(value => value.level === +items[0].subTitle.substring(6))?.updater!
          })
          items.push({
            title: 'payments.oneTimeBillPayment.dateTime',
            subTitle: this.responseValidateBillPayment.batchListsContainer?.toAuthorize[0]?.dueDate
          })
        }
        if (this.responseValidateBillPayment.batchListsContainer.notAllowed.length > 0) {
          items.push(Utils.getCurrentLevelSummaryItem(this.translate,
            this.responseValidateBillPayment.batchListsContainer?.notAllowed[0]?.futureSecurityLevelsDTOList))
          items[0].title = 'payments.oneTimeBillPayment.userLevel'
          items.push({
            title: 'payments.oneTimeBillPayment.status',
            subTitle: this.getStatus(this.responseValidateBillPayment.batchListsContainer?.notAllowed[0]?.futureSecurityLevelsDTOList.find(value => value.level === +items[0].subTitle.substring(6))?.status!),
          })
          items.push({
            title: 'payments.oneTimeBillPayment.userId',
            subTitle: this.responseValidateBillPayment.batchListsContainer?.notAllowed[0]?.futureSecurityLevelsDTOList.find(value => value.level === +items[0].subTitle.substring(6))?.updater!
          })
          items.push({
            title: 'payments.oneTimeBillPayment.dateTime',
            subTitle: this.responseValidateBillPayment.batchListsContainer?.notAllowed[0]?.dueDate
          })
        }
        break;


    }
    return items;
  }

  getStatus(item: string): string {
    var typeStatus = JSON.parse('{ "P": "Pending", "A": "Approved", "R": "Rejected" ,"I": "Initiated"}');
    return item ? typeStatus[item] : '-';
  }
}


