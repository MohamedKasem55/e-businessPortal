import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {SummaryItemModel} from "arb-design-library/model/summary-item.model";
import {FormResult, PageModel} from "../../../@core/model/dto/formModel";
import {PopupInputModel} from "../../../@core/model/dto/popup.model";
import {SelfOnBoardingLineCardsModel} from "../../../@core/model/dto/self-on-boarding-line-cards-model";
import {Account} from "../../../@core/model/rest/common/account";
import {ResponseGenerateChallenge} from "../../../@core/model/rest/common/base-response";
import {GenerateChallengeAndOTP} from "../../../@core/model/rest/common/otp.model";
import {
  BulkPaymentTransferFileUploadRes
} from "../../../@core/model/rest/transfer/bulk-payment-transfer/bulk-payment-transfer-file-upload-res";
import {
  BulkPaymentsConfirmUploadFileReq
} from "../../../@core/model/rest/transfer/bulk-payment-transfer/bulk-payments-confirm-upload-file-req";
import {
  BulkPaymentsProcessUploadFileReq
} from "../../../@core/model/rest/transfer/bulk-payment-transfer/bulk-payments-process-upload-file-req";
import {
  EligibilityCheckValidityRes
} from "../../../@core/model/rest/transfer/bulk-payment-transfer/eligibility-check-validity-res";
import {AccountsCommonService} from "../../../@core/service/accounts/accounts-common.service";
import {ModelAndListService} from "../../../@core/service/base/modelAndList.service";
import {PopupService} from "../../../@core/service/base/popup.service";
import {VerificationService} from "../../../@core/service/base/verification.service";
import {
  BulkPaymentTransferService
} from "../../../@core/service/transfer/bulk-payment-transfer/bulk-payment-transfer.service";
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {TransferBaseComponent} from "../transfer-base/transfer-base.component";
import {
  bulkPaymentOnBoarding,
  bulkPaymentOnBoardingForm,
  bulkPaymentTransfer,
  bulkPaymentTransferBenTable,
  bulkPaymentTransferErrorTable,
  bulkPaymentTransferForm,
  bulkPaymentTransferSummery,
  setSummaryItems
} from "./bulk-payment-transfer-controls";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";
import {Utils} from "../../../@core/utility/Utils";

@Component({
  selector: 'app-bulk-payment-transfer',
  templateUrl: './bulk-payment-transfer.component.html',
  styles: ['::ng-deep .md-class .modal-dialog {  max-width: 80%; width: 80%;}']
})
export class BulkPaymentTransferComponent extends TransferBaseComponent {

  landingTitle = 'transfer.blkPmtTns.self-onBoarding.bulkTransfer'
  lineCards: SelfOnBoardingLineCardsModel[] = [
    {
      image: "assets/img/arb-icon.svg",
      title: "transfer.blkPmtTns.self-onBoarding.lineCards.card1.title",
      subTitle: "transfer.blkPmtTns.self-onBoarding.lineCards.card1.subTitle"
    },
    {
      image: "assets/img/arb-icon.svg",
      title: "transfer.blkPmtTns.self-onBoarding.lineCards.card2.title",
      subTitle: "transfer.blkPmtTns.self-onBoarding.lineCards.card2.subTitle"
    },
    {
      image: "assets/img/arb-icon.svg",
      title: "transfer.blkPmtTns.self-onBoarding.lineCards.card3.title",
      subTitle: "transfer.blkPmtTns.self-onBoarding.lineCards.card3.subTitle"
    },
    {
      image: "assets/img/arb-icon.svg",
      title: "transfer.blkPmtTns.self-onBoarding.lineCards.card4.title",
      subTitle: "transfer.blkPmtTns.self-onBoarding.lineCards.card4.subTitle"
    }
  ];
  eligibilityResponse!: EligibilityCheckValidityRes;
  selectedAccount!: Account;
  startOnBoarding = false;
  showWaring = false;
  showForm = false;
  hasAccess: boolean = true;
  private uploadedFile!: File;
  private company: any;
  private bulkPaymentTransferFileUploadRes!: BulkPaymentTransferFileUploadRes;
  private generateChallengeAndOTP!: ResponseGenerateChallenge | undefined;

  constructor(private bulkPaymentTransferService: BulkPaymentTransferService,
              private modelService: ModelAndListService,
              private popService: PopupService,
              private routering: Router,
              private account: AccountsCommonService,
              private otpService: VerificationService) {
    super();
    this.setBreadcrumb([{
      text: 'transfer.transfer',
      url: '/transfer'
    }, {text: 'transfer.blkPmtTns.name', url: ''}]);
    this.router = routering;
    if (!AuthenticationUtils.hasPrivilege(['BULKPAYMENTS_PRIVILEGE'])) {
      if (AuthenticationUtils.hasAccess('BulkPaymentsSelfOnboarding')) {
        this.bulkPaymentTransferService.initiateRequest().subscribe(
          {
            next: (res) => {

              if (res.reason === "ALREADY_REGISTERED" && !res.eligibleToRegister) {
                this.showForm = true;
                this.pageTitle = bulkPaymentTransfer();
                this.drawPage()
              } else if (res.reason === "NO_TRANSFERS_PRIVILEGE") {
                this.showWaring = true;
                this.result = {
                  type: "Warning",
                  title: "transfer.blkPmtTns.noTransfersPrivilege",
                  summary: {
                    title: undefined,
                    sections: undefined,
                  }
                }
              } else if (res.reason === "COMPANY_HAS_NO_SEGMENT") {
                this.showWaring = true;
                this.result = {
                  type: "Warning",
                  title: "transfer.blkPmtTns.companyHasNoSegment",
                  summary: {
                    title: undefined,
                    sections: undefined,
                  }
                }
              } else if (res.reason === "NO_SEGMENT_ACTIVE_AGREEMENT") {
                this.showWaring = true;
                this.result = {
                  type: "Warning",
                  title: "transfer.blkPmtTns.noSegmentActiveAgreement",
                  summary: {
                    title: undefined,
                    sections: undefined,
                  }
                }
              } else if (res.eligibleToRegister) {
                this.showWaring = false;
                this.startOnBoarding = true;
                this.eligibilityResponse = res;
              }
            }
          }
        )
      } else {
        this.hasAccess = false;
        this.result = {
          type: "Warning",
          title: Utils.translateWithParams(
            'public.company-admin-only', {field: 'transfer.bulk-payment'}),
          summary: undefined
        }
      }
    } else {
      this.showForm = true;
      this.pageTitle = bulkPaymentTransfer();
      this.drawPage()
    }

  }


  override onButtonClick(formButtonClickOutPut: FormButtonClickOutput) {

    switch (formButtonClickOutPut.buttonId) {
      case "dwntemp":
        this.bulkPaymentTransferService.downloadTemplate();
        break;
      case 'appStatus':
        void this.router.navigate(["/transfer/approval"], {queryParams: {type: 'bulk'}})
        break;
      case "Next":
        if (this.startOnBoarding) {
          this.handleNextForOnBoarding()
        } else {
          this.handleNextForExecution()
        }
        break;
      case "edit-btn":
      case "Back":
        if (this.pageTitle.stepper?.stepCounter === 1) {
          this.router.navigate(['/transfer'])
        } else {
          this.pageTitle.stepper!.stepCounter--
        }
        break;
      case "goToDashboard":
        this.router.navigate(['/dashboard']).then();
        break;
      case "edit-btn-step-back":
        this.pageTitle.stepper!.stepCounter--
        break;

      case "newPayment":
        this.router.navigate(['/transfer']).then(() => {
          void this.router.navigate(['/transfer/bulk-payment'])
        });
        break;
      case "arrowTitle":
        void this.router.navigate(['/transfer'])
        break;
    }

    this.updatePageTitle()

  }

  updatePageTitle() {

    if (this.pageTitle.stepper && this.pageTitle.stepper?.stepCounter > 1) {
      this.pageTitle.title = 'transfer.blkPmtTns.self-onBoarding.bulkTransferRegistration';
    } else {
      this.pageTitle.title = 'transfer.blkPmtTns.self-onBoarding.bulkTransfer';
    }
  }

  override onResultChanged(data: FormResult[]) {
    if (data[0].id === "bulkPaymentTransfer") {
      this.endButtons[0].isDisable = !data[0].valid
    }
  }

  register(btnId: any) {
    switch (btnId.buttonId) {
      case "arrowTitle":
        this.router.navigate(['/transfer']);
        break;
      default:
        this.showForm = true;
        this.pageTitle = bulkPaymentOnBoarding();
        this.endButtons[0].isDisable = true;
        this.drawPageOnBoarding()
        break;
    }
  }

  private drawPage() {
    this.company = JSON.parse(<string>sessionStorage.getItem('company'));
    this.pages = [new PageModel(1, bulkPaymentTransferForm(this.translate, this.company.companyName, this.company.profileNumber),
    ), new PageModel(2, bulkPaymentTransferBenTable())];
    if (!this.showPendingActions) {
      this.getControl(0, 0, 'other').controlOptions.endButtons.shift()
    }
    this.getControl(0, 0, 'upload').valueChanges.subscribe((val) => {
      this.uploadedFile = val.value;
    })

  }

  private handleValidate() {
    this.bulkPaymentTransferService
      .validateUpload(
        this.uploadedFile,
        this.getControl(0, 0, 'batchName')
          .value).subscribe({
      next: (res) => {
        this.bulkPaymentTransferFileUploadRes = res;
        if (this.bulkPaymentTransferFileUploadRes.numberLinesWithErrors
          && this.bulkPaymentTransferFileUploadRes.numberLinesWithErrors > 0) {
          this.showErrorTable();
        } else {
          this.pages[1].forms[0].controls['benDtls'].controlOptions.data = res.pageListBulk;
          this.pageTitle.stepper!.stepCounter++
          if (this.bulkPaymentTransferFileUploadRes.bulkPaymentsBatchDTO!.nextStatus === "100") {
            this.generateChallengeAndOTP = res.generateChallengeAndOTP
          }
        }
        this.endButtons[0].showLoading = false;
      },
      error: () => {
        this.endButtons[0].showLoading = false;
        this.pages[1].forms[0].controls['benDtls'].controlOptions.data = [];
      }
    });
  }

  private handleConfirm() {
    this.endButtons[0].showLoading = true;
    const req: BulkPaymentsConfirmUploadFileReq = {
      bulkPaymentsBatchDTO: this.bulkPaymentTransferFileUploadRes.bulkPaymentsBatchDTO,
      bulkPaymentsDetailsDTO: this.bulkPaymentTransferFileUploadRes.bulkPaymentsDetailsDTO
    }
    this.bulkPaymentTransferService.confirmUploadAndMoveToNextLevel(req).subscribe({
      next: () => {
        this.result = {
          type: "Success",
          title: "transfer.blkPmtTns.success",
          summary: this.summary,
        }
        this.setEndButtons()
        this.pageTitle.stepper!.stepCounter++;
      },
      error: () => {
        this.endButtons[0].showLoading = false;
      }
    })
  }

  private showErrorTable() {
    this.modelService.getModel("errors").subscribe((res) => {
      for (const error of this.bulkPaymentTransferFileUploadRes.lineValidationDTOList) {
        let errorCode = 'errorTable.' + error.errorCode;
        error.errorCode = res.errors[errorCode];
      }
      let errors: PopupInputModel = {
        title: "public.error",
        form: bulkPaymentTransferErrorTable(this.translate,
          this.bulkPaymentTransferFileUploadRes.lineValidationDTOList.sort(
            (item1, items2) => item1.lineNumber - items2.lineNumber),
          this.bulkPaymentTransferFileUploadRes.lineValidationDTOList.length),
        options: {
          centered: true,
          windowClass: 'md-class',
          fullscreen: "lg"
        }
      }
      this.popService.showPopup(errors)
    });
  }

  private setSummaryDetails() {
    let items: SummaryItemModel[] = [];

    setSummaryItems(items, this.translate, this.pages[0].forms[0], this.bulkPaymentTransferFileUploadRes)

    items.push(...this.getFormSummaryItem(this.pages[0].forms[0]));

    this.summary = bulkPaymentTransferSummery()

    this.summary?.sections?.push({items});

    this.pageTitle.stepper!.stepCounter++
  }

  private processUpload() {
    this.endButtons[0].showLoading = true;
    let generateChallengeAndOTP: GenerateChallengeAndOTP = {
      typeAuthentication: this.generateChallengeAndOTP!.typeAuthentication
    }
    this.otpService.showVerification(generateChallengeAndOTP).subscribe((requestValidate) => {
      const req: BulkPaymentsProcessUploadFileReq = {
        bulkPaymentsBatchDTO: this.bulkPaymentTransferFileUploadRes.bulkPaymentsBatchDTO,
        requestValidate: requestValidate
      }
      this.bulkPaymentTransferService.processUpload(req).subscribe({
        next: () => {
          this.result = {
            type: "Success",
            title: "transfer.blkPmtTns.success",
            summary: this.summary,
          }
          this.setEndButtons()
          this.pageTitle.stepper!.stepCounter++;
        },
        error: () => {
          this.endButtons[0].showLoading = false;
        }
      })
    });
  }

  private setEndButtons() {
    this.startButtons = []
    this.endButtons = [{
      id: "goToDashboard",
      type: 'secondary',
      text: "public.go-to-dashboard"
    },
      {
        id: "newPayment",
        type: 'primary',
        text: "transfer.blkPmtTns.new-payment"
      }
    ]
  }

  private drawPageOnBoarding() {
    this.company = JSON.parse(<string>sessionStorage.getItem('company'));
    this.account.getSarAccounts().subscribe((accounts) => {
      this.pages = [new PageModel(1, bulkPaymentOnBoardingForm(this.translate,
        this.company.companyName,
        this.company.profileNumber,
        this.eligibilityResponse.fees.monthlyFees,
        this.eligibilityResponse.fees.rajhiTxFees,
        accounts.listAlertsPermissionAccount)
      )];
      this.getControl(0, 0, 'selectAccount').valueChanges.subscribe((val) => {
        this.endButtons[0].isDisable = false;
        this.selectedAccount = val.value
      })
    })

  }

  private handleNextForOnBoarding() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.setOnBoardingSummaryDetails();
        break;
      case 2:
        this.handleOnBoardingValidate()
        break;
    }
  }

  private handleNextForExecution() {

    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.endButtons[0].showLoading = true;
        this.handleValidate()
        break;
      case 2:
        this.setSummaryDetails();
        break;
      case 3:
        if (this.bulkPaymentTransferFileUploadRes.bulkPaymentsBatchDTO.nextStatus !== "100") {
          this.handleConfirm()
        } else {
          this.processUpload()
        }
        break;
    }
  }

  private setOnBoardingSummaryDetails() {
    this.summary = {
      title: {
        id: "summary-title",
        type: 'Section',
        title: "Summary"
      },
      sections: []
    }

    this.summary?.sections?.push(
      {
        title: {
          id: "subscription-detalis",
          type: 'Section',
          title: "public.subscriptionDetails",
          startButtons: [{
            id: "edit-btn",
            type: 'secondary',
            text: 'Edit',
          }]
        },
        items: [
          {
            title: 'public.cic',
            subTitle: this.getControl(0, 0, 'orgCIC').value,
          },
          {
            title: 'transfer.blkPmtTns.self-onBoarding.monthlyFees',
            subTitle: this.getControl(0, 0, 'monthlyFees').value,
          },
          {
            title: 'transfer.blkPmtTns.self-onBoarding.trnxFees',
            subTitle: this.getControl(0, 0, 'trnxFees').value,
          },
        ]
      },
      {
        title: {
          id: "account-details",
          type: 'Section',
          title: "transfer.account-details",
          startButtons: [{
            id: "edit-btn",
            type: 'secondary',
            text: 'Edit',
          }]
        },
        items: [
          {
            title: 'accounts.selectAccount',
            subTitle: this.getControl(0, 0, 'selectAccount').value.fullAccountNumber,
          }
        ]
      },
    );


    this.pageTitle.stepper!.stepCounter++
  }

  private handleOnBoardingValidate() {
    this.bulkPaymentTransferService.validateNewRegistration({ibanNumber: this.selectedAccount.ibanNumber}).subscribe((res) => {
      this.otpService.showVerification(res.generateChallengeAndOTP).subscribe((otp) => {
        this.bulkPaymentTransferService.confirmNewRegistration({
          requestValidate: otp,
          ibanNumber: this.selectedAccount.ibanNumber
        }).subscribe({
          next: () => {
            this.result = {
              type: "Success",
              title: "transfer.blkPmtTns.bulkRegistration",
              summary: this.summary,
            }
            this.setEndButtons()
            this.pageTitle.stepper!.stepCounter++;
          },
          error: () => {
            this.endButtons[0].showLoading = false;
          }
        })
      })
    })
  }
}
