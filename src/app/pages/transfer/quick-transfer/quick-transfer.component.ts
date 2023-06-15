import {DatePipe} from "@angular/common";
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {FormResult, PageModel} from 'app/@core/model/dto/formModel';
import {ResultModal} from 'app/@core/model/dto/result.modal';
import {PendingActionFactory} from 'app/@core/service/base/pending-action-factory.service';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {BoxModel} from 'arb-design-library/model/box.model';
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ValidationsEnum} from "../../../@core/model/dto/validations-enum";
import {RequestValidate} from "../../../@core/model/rest/common/otp.model";
import {ConfirmReqModel} from "../../../@core/model/rest/transfer/local-transfer/confirm-req.model";
import {QuickProxyModel} from "../../../@core/model/rest/transfer/local-transfer/validate-req.model";
import {ValidateResModel} from "../../../@core/model/rest/transfer/local-transfer/validate-res.model";
import {ResponseException} from "../../../@core/service/base/responseException";
import {IPSTransferService} from "../../../@core/service/transfer/ips/ips.service";
import {LocalTransferService} from "../../../@core/service/transfer/local_transfer/local-transfer.service";
import {TransferService} from "../../../@core/service/transfer/transfer.service";
import {Utils} from "../../../@core/utility/Utils";
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {TransferBaseComponent} from '../transfer-base/transfer-base.component';
import {proxyForm} from './quick-transfer-controls';

@Component({
  selector: 'app-quick-transfer',
  templateUrl: '../transfer-base/transfer-base.component.html'
})
export class QuickTransferComponent extends TransferBaseComponent implements OnInit {

  validateResponse!: ValidateResModel;
  quickProxyModel!: QuickProxyModel;

  constructor(public fb: FormBuilder, private localTransferService: LocalTransferService,
              private iPSTransferService: IPSTransferService, private transferService: TransferService,
              private pendingActionFactory: PendingActionFactory,
              private datePipe: DatePipe,
              private otpService: VerificationService) {
    super();
    this.setBreadcrumb([{
      text: 'transfer.transfer',
      url: '/transfer'
    }, {text: 'transfer.quick-transfer.title', url: ''}]);
    this.pageTitle.id = 'QuickTransfer';
    this.pageTitle.title = "transfer.quick-transfer.title";
    this.pageTitle.showArrow = true;
    this.drawPage();
    this.nextButton.isDisable = true
  }

  override onResultChanged(data: FormResult[]) {
    this.endButtons[0].isDisable = !data[0].valid;
  }

  ngOnInit(): void {
    this.getBankName();
    this.getConfig();
    this.getAccounts();
    this.getPurpose();
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, proxyForm())];
    this.getControl(0, 0, 'proxy').valueChanges.subscribe(value => {
      this.switchOptions(value.value)
    });
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.setQuickProxy();
        this.validateLocalTransfer();
        break;
      case 2:
        this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess.length > 0 ? this.showOtp() : this.confirmLocalTransfer();
        break;
    }
  }

  setQuickProxy() {
    let quickProxyType: QuickProxyModel = {
      participantBankId: this.getControl(0, 0, "bankNameControl").value!.participantId,
      proxyType: {
        type: "",
        value: ""
      }
    };


    switch (this.getControl(0, 0, "proxy").value) {
      case "mobile":
        quickProxyType.proxyType!.type = 'MOIBLE_NUMBER';
        quickProxyType.proxyType!.value = "966" + this.getControl(0, 0, "mobileControl").value;
        break;
      case "email":
        quickProxyType.proxyType!.type = 'EMAIL';
        quickProxyType.proxyType!.value = this.getControl(0, 0, "emailControl").value;
        break;
      case "nationalId":
        quickProxyType.proxyType!.type = 'CR_OR_UNNID';
        quickProxyType.proxyType!.value = this.getControl(0, 0, "nationalIdControl").value;
        break;
      case "iban":
        // quickProxyType.proxyType.type = 'IBAN';
        // quickProxyType.proxyType.value = this.getControl(0, 0, "ibanControl").value;
        quickProxyType.proxyType = null;
        quickProxyType.beneficiaryIBAN = this.getControl(0, 0, "ibanControl").value;
        quickProxyType.beneficiaryName = this.getControl(0, 0, "nameControl").value + " " + this.getControl(0, 0, "surnameControl").value

        break;
    }

    this.quickProxyModel = quickProxyType;
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'Confirm':
        this.nextClick();
        break;
      case 'arrowTitle':
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'PendingActions':
        void this.router.navigate(["/pendingActions/pending-actions-list"]);
        break;
      case 'Transfers':
        void this.router.navigate(['/transfer']);
        break;
      case 'goToDashboard':
        this.router.navigate(['/dashboard']).then(() => {
        });
        break;
    }
  }

  switchOptions(type: string) {
    this.hideAndDisableControls(0, 0, ["mobileControl", "ibanControl", "nationalIdControl", "emailControl", "nameControl", "surnameControl"]);
    switch (type) {
      case "mobile":
        this.showAndEnableControls(0, 0, ["mobileControl"]);
        break;
      case "iban":
        this.showAndEnableControls(0, 0, ["ibanControl", "nameControl", "surnameControl"]);
        this.getControl(0, 0, "ibanControl").setValue("SA");
        break;
      case "email":
        this.showAndEnableControls(0, 0, ["emailControl"]);
        break;
      case "nationalId":
        this.showAndEnableControls(0, 0, ["nationalIdControl"]);
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigate(['/transfer']);
        break;
      case 2:
        this.endButtons[0].showLoading = false;
        this.endButtons[0].text = "public.next";
        this.stepperMoveBack();
        break;
    }
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    let account = this.getControl(0, 0, "fromAccountControl").value;
    let items = [
      {
        title: 'public.from',
        subTitle: account.alias ? account.alias + ' ' + account.fullAccountNumber : account.fullAccountNumber
      },
      {
        title: 'public.date',
        subTitle: this.datePipe.transform(new Date(), "MMM dd, YYYY")
      },
      {
        title: 'transfer.transfer-amount',
        subTitle: this.getControl(0, 0, "amountControl").value,
        currency: this.getControl(0, 0, "amountControl").value.currency
      },
      {
        title: 'transfer.fees-vat-included',
        subTitle: this.validateResponse.totalFeeProcess ? this.validateResponse.totalFeeProcess : "0.00",
        currency: 'SAR'
      },
      {
        title: 'transfer.purpose',
        subTitle: this.translate.currentLang == 'en' ? this.getControl(0, 0, "purposeControl").value.purposeDescriptionEn : this.getControl(0, 0, "purposeControl")
          .value.purposeDescriptionAr,
      },
      {
        title: 'transfer.channel',
        subTitle: this.translate.instant("transfer.quick-transfer.proxy." + this.getControl(0, 0, "proxy").value)
      },

      {
        title: 'transfer.beneficiary-bank',
        subTitle: this.getControl(0, 0, "bankNameControl").value.participantFullName,
      },
      {
        title: 'transfer.remarks',
        subTitle: this.getControl(0, 0, "remarksControl").value,
      },


      this.getControl(0, 0, "proxy").value == "iban" ?
        {
          title: 'transfer.beneficiary-name',
          subTitle: this.getControl(0, 0, "nameControl").value! + ' ' + this.getControl(0, 0, "surnameControl").value,
        } : {},
      this.getControl(0, 0, "proxy").value == "iban" ? {
        title: 'transfer.first-name',
        subTitle: this.getControl(0, 0, "nameControl").value!,
      } : {},
      this.getControl(0, 0, "proxy").value == "iban" ? {
        title: 'transfer.last-name',
        subTitle: this.getControl(0, 0, "surnameControl").value,
      } : {},

      this.getControl(0, 0, "proxy").value == "iban" ? {
        title: 'transfer.urpay-transfer.IBAN',
        subTitle: this.getControl(0, 0, "ibanControl").value && this.getControl(0, 0, "ibanControl").value !== 'SA' ? this.getControl(0, 0, "ibanControl").value : '',
      } : {},

      Utils.getCurrentLevelSummaryItem(this.translate, this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess.length > 0 ? this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess[0].futureSecurityLevelsDTOList : this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize ? this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize[0].futureSecurityLevelsDTOList : undefined),
      Utils.getNextLevelSummaryItem(this.translate, this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess.length > 0 ? this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess[0].futureSecurityLevelsDTOList : this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize ? this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize[0].futureSecurityLevelsDTOList : undefined),
    ];
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
        subTitle: 'public.total-amount',
        amount: this.getControl(0, 0, "amountControl").value,
        currency: this.getControl(0, 0, "fromAccountControl").value!.currency
      }
      ,
      sections: [{
        pill: {text: 'TRANSFER #1', type: 'Neutral'},
        title: {
          id: 'transferDetailsTitle',
          title: 'transfer.transfer-details',
          startButtons: showEditButton ? [this.editButton] : [],
        },
        items
      }]
    }
  }


  // Get Config
  getConfig() {
    this.iPSTransferService.getIPSConfig().subscribe((res: any) => {
      const max: string = res.maxQTL;
      this.getControl(0, 0, "amountControl").setValidators([{validation: ValidationsEnum.MIN, options: "1"}, {
        validation: ValidationsEnum.MAX,
        options: res.maxQTL.toString()
      }]);
      this.getControl(0, 0, "amountControl").validationLabels = {
        min: "transfer.amount-is-required",
        required: 'transfer.amount-is-required',
        max: 'transfer.maximum-transfer-limit',
        translateOptions: {"0": res.maxQTL.toString()}
      };
    })
  }

  // Get bank Name
  getBankName() {
    this.iPSTransferService.getParticipantBank().subscribe((res: any) => {
      this.getControl(0, 0, "bankNameControl").controlOptions.options = res.participantBankItems;
    })
  }

  // Get Accounts
  getAccounts() {
    this.localTransferService.getInitiate().subscribe((res: any) => {
      this.getControl(0, 0, "fromAccountControl").controlOptions.options = res.listAccount;
      this.getControl(0, 0, "fromAccountControl").setValue(res.listAccount[0]);
    })
  }

  // Get Purpose
  getPurpose() {
    this.transferService.getTransferPurpose({transferPurposeType: 'LOCAL'}).subscribe((res: any) => {
      this.getControl(0, 0, "purposeControl").controlOptions.options = res.transferReasonsList;
    })
  }

  validateLocalTransfer() {
    this.endButtons[0].showLoading = true;
    this.localTransferService.validateLocalTransfer(this.returnRequestValidateLocalTransfer()).subscribe({
      next: (res) => {
        this.validateResponse = res;
        this.stepperMoveNext();
        this.summary = this.fillSummary();
        this.endButtons[0].showLoading = false;
        this.endButtons = [this.confirmButton];
        this.endButtons[0].isDisable = false;
      },
      error: () => {
        this.endButtons[0].showLoading = false;
      }
    });
  }

  confirmLocalTransfer(otp?: RequestValidate) {
    let confirmReqModel = this.returnRequestConfirmLocalTransfer(otp);
    this.localTransferService.confirmLocalTransfer(confirmReqModel).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.summary = {};
          this.hasNextApprovalLevel = this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize ? this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize.length > 0 : false;
          this.result = this.fillSuccessResult(this.hasNextApprovalLevel);
          this.endButtons = (this.hasNextApprovalLevel && (this.showPendingActions)) ? [this.pendingActionsButton, this.transferButton] : [this.goToDashboardButton, this.transferButton];
          if (this.hasNextApprovalLevel)
            this.pendingActionFactory.fetchPendingActions();
        },
        error: (error: ResponseException) => {
          this.nextButton.showLoading = false;
        }
      });
  }


  returnRequestValidateLocalTransfer(): any {
    let dateTime = new Date().toISOString()
    return {
      listTransfersLocal: [{
        accountForm: this.getControl(0, 0, "fromAccountControl").value,
        amount: this.getControl(0, 0, "amountControl").value!,
        currency: parseInt(this.getControl(0, 0, "fromAccountControl").value.currency),
        purposeCodeTransfer: this.getControl(0, 0, "purposeControl").value!.purposeCode,
        remarks: this.getControl(0, 0, "remarksControl").value!,
      }
      ],
      operationDate: dateTime,
      segment: JSON.parse(sessionStorage.getItem('welcome')!).segment,
      quickProxy: this.quickProxyModel
    }
  }

  returnRequestConfirmLocalTransfer(otp?: RequestValidate): ConfirmReqModel {
    return {
      batchList: this.validateResponse.checkAndSeparateInitiatitionPermission,
      requestValidate: otp
    }
  }


  private showOtp() {
    this.otpService.showVerification(this.validateResponse.generateChallengeAndOTP).subscribe((data: RequestValidate) => {
      this.confirmLocalTransfer(data);
    });
  }

  fillSuccessResult(hasNextApprovalLevel: boolean): ResultModal {
    return {
      type: (hasNextApprovalLevel) ? 'Pending' : 'Success',
      title: (hasNextApprovalLevel) ? 'public.submit-success' : 'transfer.money-successfully-transferred',
      showSariaLogo: true,
      subTitle: this.translate.instant('transfer.quick-transfer.title') + ' - ' + this.getReturnChannel(),
      summary: this.fillSummary(false),
    };
  }

  fillErrorResult(errString: string):
    ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(false),
    };
  }

  getReturnChannel(): string {
    return this.getControl(0, 0, 'proxy').controlOptions['box'].find((optionBox: BoxModel) =>
      (optionBox.id === this.getControl(0, 0, 'proxy').value)).text
  }

}
