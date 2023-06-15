import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {FormResult, PageModel} from 'app/@core/model/dto/formModel';
import {ResultModal} from 'app/@core/model/dto/result.modal';
import {ValidationsEnum} from 'app/@core/model/dto/validations-enum';
import {PendingActionFactory} from 'app/@core/service/base/pending-action-factory.service';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {SummaryModel} from "arb-design-library/model/summary.model";
import {ValueChangeResult} from "../../../@core/model/dto/control/control.model";
import {RequestValidate} from "../../../@core/model/rest/common/otp.model";
import {TransferReasonReqModel} from "../../../@core/model/rest/common/transfer-reason-req.model";
import {ConfirmReqModel} from "../../../@core/model/rest/transfer/urpayTransfer/confirm-req.model";
import {CustomerDetailsReqModel} from "../../../@core/model/rest/transfer/urpayTransfer/customer-details-req.model";
import {CustomerDetailsResModel} from "../../../@core/model/rest/transfer/urpayTransfer/customer-details-res.model";
import {ValidateReqModel} from "../../../@core/model/rest/transfer/urpayTransfer/validate-req.model";
import {ValidateResModel} from "../../../@core/model/rest/transfer/urpayTransfer/validate-res.model";
import {ResponseException} from "../../../@core/service/base/responseException";
import {LocalTransferService} from "../../../@core/service/transfer/local_transfer/local-transfer.service";
import {UrPayTransferService} from "../../../@core/service/transfer/urpay-transfer/urpay-transfer.service";
import {Utils} from "../../../@core/utility/Utils";
import {FormButtonClickOutput} from "../../../shared/form/form.component";
import {TransferBaseComponent} from '../transfer-base/transfer-base.component';
import {accountForm, proxyForm} from "./urpay-transfer-controls";


@Component({
  selector: 'app-urpay-transfer',
  templateUrl: '../transfer-base/transfer-base.component.html',
  styleUrls: []
})
export class UrpayTransferComponent extends TransferBaseComponent {

  validateResponse!: ValidateResModel;
  customerDetailsResponse!: CustomerDetailsResModel;

  constructor(public fb: FormBuilder,
              private urPayTransferService: UrPayTransferService, private localTransferService: LocalTransferService,
              private pendingActionFactory: PendingActionFactory,
              private otpService: VerificationService) {
    super();
    this.setBreadcrumb([{
      text: 'transfer.transfer',
      url: '/transfer'
    }, {text: 'transfer.urpay-transfer.title', url: ''}]);
    this.pageTitle.id = 'URPayTransfer';
    this.pageTitle.title = "transfer.urpay-transfer.title";
    this.pageTitle.showArrow = true;
    this.pageTitle.stepper!.steps = ["", "", "", ""];
    this.drawPage();
    this.nextButton.isDisable = true;
  }

  override onResultChanged(data: FormResult[]) {
    this.endButtons[0].isDisable = !data[0].valid;
  }


  drawPage() {
    this.pages = [new PageModel(1, proxyForm()), new PageModel(2, accountForm())];

    this.getControl(0, 0, 'proxy').valueChanges.subscribe((value: ValueChangeResult) => {
      this.switchOptions(value.value)
    });
  }

  fillSuccessResult(hasNextApprovalLevel: boolean): ResultModal {
    return {
      type: (hasNextApprovalLevel) ? 'Pending' : 'Success',
      title: (hasNextApprovalLevel) ? 'public.submit-success' : 'transfer.money-successfully-transferred',
      subTitle: 'transfer.urpay-transfer.title',
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
    this.hideAndDisableControls(0, 0, ["mobile", "iban"]);
    switch (type) {
      case "mobile":
        this.showAndEnableControls(0, 0, ["mobile"]);
        break;
      case "iban":
        this.showAndEnableControls(0, 0, ["iban"]);
        this.getControl(0, 0, "iban").setValue("SA");
        break;
    }
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.nextButton.showLoading = true;
        this.getCustomerDetails();
        this.nextButton.isDisable = true;
        break;
      case 2:
        this.validateTransfer();
        break;
      case 3:
        this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess.length > 0 ? this.showOtp() : this.confirmUrpayTransfer();
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        void this.router.navigate(['/transfer']);
        break;
      case 2:
      case 3:
        this.nextButton.isDisable = false;
        this.endButtons = [this.nextButton];
        this.nextButton.showLoading = false;
        this.stepperMoveBack()
        break;

    }
  }


  validateTransfer() {
    this.nextButton.showLoading = true;
    this.urPayTransferService.urpayValidate(this.returnRequestValidate()).subscribe(
      {
        next: (res) => {
          this.validateResponse = res;
          this.stepperMoveNext();
          this.summary = this.fillSummary();
          this.endButtons = [this.confirmButton];
        },
        error: () => {
          this.nextButton.showLoading = false;
        }
      });
  }

  confirmUrpayTransfer(otp?: any) {
    this.nextButton.showLoading = true;
    let confirmReqModel = this.returnRequestConfirm(otp);
    this.urPayTransferService.urpayConfirm(confirmReqModel).subscribe(
      {
        next: (res) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.summary = {};
          this.hasNextApprovalLevel = this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize ? this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize.length > 0 : false;
          this.result = this.fillSuccessResult(this.hasNextApprovalLevel);
          this.endButtons = ( this.hasNextApprovalLevel && (this.showPendingActions)) ? [this.pendingActionsButton, this.transferButton] : [this.goToDashboardButton, this.transferButton];
          if (this.hasNextApprovalLevel)
            this.pendingActionFactory.fetchPendingActions();
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.endButtons = [this.transferButton];
          this.startButtons = [];
          this.summary = {};
          this.result = this.fillErrorResult(error.ErrorResponse.errorDescription!);
        }
      });
  }

  returnRequestValidate(): ValidateReqModel {
    return {
      remitterName: this.customerDetailsResponse.customerNameAR,
      remitterIBAN: this.getControl(1, 0, "fromAccount").value.ibanNumber,
      accountForm: this.getControl(1, 0, "fromAccount").value,
      topupAmount: {
        amount: this.getControl(1, 0, "amount").value!,
        currency: "SAR"
      },
      walletMobileNum: this.getControl(0, 0, "mobile").value! ? this.getControl(0, 0, "mobile").value! : '',
      walletVIBAN: this.getControl(0, 0, "iban").value! && this.getControl(0, 0, "iban").value !== 'SA' ? this.getControl(0, 0, "iban").value! : '',
      remarks: this.getControl(1, 0, "remarks").value!,
    }
  }

  returnRequestConfirm(otp: RequestValidate): ConfirmReqModel {
    return {
      batchList: this.validateResponse.checkAndSeparateInitiatitionPermission,
      totalAmountProcess: this.validateResponse.totalAmountProcess,
      emailChecked: '',
      listbatchToDelete: [],
      typeBatchList: "batchListSelectedLocal",
      requestValidate: otp
    }
  }

  fillSummary(showEditButton: boolean = true): SummaryModel {
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
        subTitle: 'public.total-amount',
        amount: this.getControl(1, 0, "amount").value,
        currency: this.getControl(1, 0, "fromAccount").value!.currency

      },
      sections: [
        {
          pill: {text: 'URPAY TRANSFER #1', type: 'Neutral'},
          title: {
            id: 'transferDetailsTitle',
            title: this.translate.currentLang == 'en' ? this.customerDetailsResponse.customerNameEN : this.customerDetailsResponse.customerNameAR,
            subTitle: this.getControl(0, 0, "proxy").value == 'mobile' ? this.translate.instant('public.mobile') + ': +966' + this.getControl(0, 0, "mobile").value : this.translate.instant('transfer.urpay-transfer.IBAN') + ' : ' + this.getControl(0, 0, "iban").value,
            startButtons: showEditButton ? [this.editButton] : [],
          },
          items: [
            {
              title: 'public.from',
              subTitle: this.getControl(1, 0, "fromAccount").value.alias + ' ' + this.getControl(1, 0, "fromAccount").value.fullAccountNumber
            },
            {
              title: 'public.amount',
              subTitle: this.getControl(1, 0, "amount").value!,
              currency: this.getControl(1, 0, "fromAccount").value!.currency
            },
            {
              title: this.translate.instant('transfer.fees-vat-included'),
              subTitle: this.validateResponse.totalFeeProcess !== null ? this.validateResponse.totalFeeProcess.toString() : this.validateResponse.totalFeeAuthorize.toString(),
              currency: 'SAR'
            },
            // {
            //   title: "Purpose",
            //   subTitle: this.translateService.currentLang == 'en' ? this.getControl(1, 0, "purpose").value.purposeDescriptionEn : this.getControl(1, 0, "purpose").value.purposeDescriptionAr
            // },
            {
              title: 'transfer.remarks',
              subTitle: this.getControl(1, 0, "remarks").value!,
            },
            // {
            //   title: 'transfer.urpay-transfer.channel-type',
            //   subTitle: this.getControl(0, 0, "mobile").value ? this.translate.instant('transfer.urpay-transfer.MOBILE') : this.translate.instant('transfer.urpay-transfer.IBAN')
            // },
            Utils.getCurrentLevelSummaryItem(this.translate, this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess.length > 0 ? this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess[0].futureSecurityLevelsDTOList : this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize ? this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize[0].futureSecurityLevelsDTOList : undefined),
            Utils.getNextLevelSummaryItem(this.translate, this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess.length > 0 ? this.validateResponse.checkAndSeparateInitiatitionPermission.toProcess[0].futureSecurityLevelsDTOList : this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize ? this.validateResponse.checkAndSeparateInitiatitionPermission.toAuthorize[0].futureSecurityLevelsDTOList : undefined),
          ],
        },
      ],
    };
  }

  getAccounts() {
    this.localTransferService.getInitiate().subscribe((res: any) => {
      this.getControl(1, 0, "fromAccount").controlOptions.options = res.listAccount;
      this.getControl(1, 0, "fromAccount").setValue(res.listAccount[0]);
      this.getControl(1, 0, "amount").setValidators([{validation: ValidationsEnum.MIN, options: "1"}, {
        validation: ValidationsEnum.MAX,
        options: res.transferLimit
      }]);
      this.getControl(1, 0, "amount").validationLabels!.translateOptions = {"0": res.transferLimit.toString()}
    })
  }

  getCustomerDetails() {
    this.urPayTransferService.urpayCustomerDetails(this.returnRequestCustomerDetails()).subscribe(
      {
        next: (res) => {
          this.customerDetailsResponse = res;
          this.translate.currentLang == 'en' ? this.getControl(1, 0, "benefTitle").controlOptions.title = this.customerDetailsResponse.customerNameEN : this.getControl(1, 0, "benefTitle").controlOptions.title = this.customerDetailsResponse.customerNameAR;
          this.getControl(1, 0, "benefTitle").controlOptions.subTitle = this.getControl(0, 0, "mobile").value ? this.translate.instant('public.mobile') + ' : +966' + this.getControl(0, 0, "mobile").value! : this.translate.instant('transfer.urpay-transfer.IBAN') + ' : ' + this.getControl(0, 0, "iban").value!
          this.getAccounts();
          // this.getPurpose();
          this.stepperMoveNext();
          this.nextButton.showLoading = false;
        },
        error: () => {
          this.nextButton.showLoading = false;
        }
      });
  }

  private showOtp() {
    this.otpService.showVerification(this.validateResponse.generateChallengeAndOTP).subscribe((data: RequestValidate) => {
      this.confirmUrpayTransfer(data);
    });
  }


  returnRequestToGetOPurpose(): TransferReasonReqModel {
    return {
      transferPurposeType: 'LOCAL',
    }
  }

  returnRequestCustomerDetails(): CustomerDetailsReqModel {
    return {
      walletMobileNum: this.getControl(0, 0, "proxy").value == 'mobile' ? this.getControl(0, 0, "mobile").value : '',
      walletVIBAN: this.getControl(0, 0, "proxy").value == 'iban' ? this.getControl(0, 0, "iban").value : '',
    }
  }


}
