import { Component, OnInit } from '@angular/core';
import { DateControl } from 'app/@core/model/dto/control/date-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { NumberInputControl } from 'app/@core/model/dto/control/number-input-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import {
  FormModel,
  FormResult,
  PageModel,
} from 'app/@core/model/dto/formModel';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import {
  GenerateChallengeAndOTP,
  RequestValidate,
} from 'app/@core/model/rest/common/otp.model';
import { BatchListSadad } from 'app/@core/model/rest/payments/government/batch-sadad';
import { ConfirmRequest } from 'app/@core/model/rest/payments/government/confirm-request';
import { PrepareAlienControlRequest } from 'app/@core/model/rest/payments/government/prepare-alien-control-request';
import { PrepareCivilDefenseViolationsRequest } from 'app/@core/model/rest/payments/government/prepare-civil-defense-violations-request';
import { PrepareCivilRegistrationRequest } from 'app/@core/model/rest/payments/government/prepare-civil-registration-request';
import { PrepareDrivingLicenseRequest } from 'app/@core/model/rest/payments/government/prepare-driving-license-request';
import { PrepareMotorVehiclesRequest } from 'app/@core/model/rest/payments/government/prepare-motor-vehicles-request';
import { PreparePublicViolationRequest } from 'app/@core/model/rest/payments/government/prepare-public-violation-request';
import { PrepareSaudiPassportRequest } from 'app/@core/model/rest/payments/government/prepare-saudi-passport-request';
import { PrepareTrafficViolationsRequest } from 'app/@core/model/rest/payments/government/prepare-traffic-violations-request';
import { PrepareVisaRegistrationRequest } from 'app/@core/model/rest/payments/government/prepare-visa-registration-request';
import { ValidateRequest } from 'app/@core/model/rest/payments/government/validate-request';
import { ValidateResponse } from 'app/@core/model/rest/payments/government/validate-response';
import { AccountsCommonService } from 'app/@core/service/accounts/accounts-common.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { ResponseException } from 'app/@core/service/base/responseException';
import { VerificationService } from 'app/@core/service/base/verification.service';
import {
  GovermentPaymentService,
  PaymentSadadModel,
} from 'app/@core/service/payments/government/government-payment.service';
import { Utils } from 'app/@core/utility/Utils';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { AmountControl } from '../../../@core/model/dto/control/amount-control';
import { ValueChangeResult } from '../../../@core/model/dto/control/control.model';
import { PaymentBaseComponent } from '../payment-base/payment-base.component';
import {
  addedForm,
  deleteButton,
  getEndButtons,
  moiPaymentsForm,
  SelectionTypeNamesP,
  SelectionTypeNamesR,
} from './government-payment-controls';
import { MOI_PAYMENTS_FORMS_FIELDS_CONFIGS } from './MOI_payment';
import { MOI_REFUNDS_FORMS_FIELDS_CONFIGS } from './MOI_refund';

@Component({
  selector: 'app-government-payment',
  templateUrl: '../payment-base/payment-base.component.html',
})
export class GovernmentPaymentComponent
  extends PaymentBaseComponent
  implements OnInit
{
  combosData: any = [];
  alienResponse: BatchListSadad[] = [];
  list:
    | PrepareAlienControlRequest[]
    | PrepareCivilDefenseViolationsRequest[]
    | PrepareCivilRegistrationRequest[]
    | PrepareDrivingLicenseRequest[]
    | PrepareMotorVehiclesRequest[]
    | PreparePublicViolationRequest[]
    | PrepareSaudiPassportRequest[]
    | PrepareTrafficViolationsRequest[]
    | PrepareVisaRegistrationRequest[] = [];
  paymentsBatch: BatchListSadad[] = [];
  appType: any;
  batchList!: BatchListSadad;
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  tab: string = '';
  dropsData: any;
  validateResponse!: ValidateResponse;
  accounts: any;
  isDisabled: boolean = false;
  serv = {
    key: '',
    value: '',
    displayText: '',
    selected: false,
  };
  appt = {
    key: '',
    value: '',
    displayText: '',
    selected: false,
  };

  constructor(
    private modelAndListService: ModelAndListService,
    private govermentPaymentService: GovermentPaymentService,
    private otpService: VerificationService,
    private accountsService: AccountsCommonService
  ) {
    super();
    this.pageTitle.endButtons!.unshift({
      id: 'feedbackFiles',
      type: 'secondary',
      text: 'payments.feedback-files.title',
    });
  }

  override ngOnInit(): void {
    this.tab = 'P';
    this.pageTitle.id = 'GovernmentPayment';
    this.pageTitle.title = 'payments.government.configure-payment';
    this.pageTitle.stepper!.steps = ['', '', ''];
    this.setBreadcrumb([
      {
        text: 'payments.payment',
        url: 'payments/',
      },
      { text: 'payments.government.moi-payments', url: 'payments/' },
      { text: 'payments.government.configure-payment', url: '' },
    ]);
    this.drawPage();
    this.getControl(
      0,
      this.pages[0].forms.length - 1,
      'paymentPill'
    ).controlOptions.text =
      this.translate.instant('payments.government.pill-payment') + '1';

    this.combosData['applicationsTypesAllCombosKey'] =
      this.getCombosDatasKeysForApplicationTypes();
    this.getModel(false);
    this.getAccounts();
    this.endButtons[0].isDisable = false;
    this.setAppAndServiceType();
    this.endButtons = [this.additionalRefundButton, this.nextButton];
    this.endButtons[1].isDisable = true;
  }

  getModel(reset: boolean) {
    this.modelAndListService
      .getList(this.tab === 'P' ? SelectionTypeNamesP : SelectionTypeNamesR)
      .subscribe((data) => {
        delete data[this.tab === 'P' ? 'eGovSadadType' : 'eGovSadadRType'][
          '000'
        ];
        this.dropsData = data;
        this.setServiceType();
        if (reset) {
          this.resetForm();
        }
      });
  }

  setServiceType() {
    var output = Object.entries(
      this.tab === 'P'
        ? this.dropsData.eGovSadadType
        : this.dropsData.eGovSadadRType
    ).map(([key, value]) => ({ key, value }));
    this.appType = output;
    this.getControl(
      0,
      this.pages[0].forms.length - 1,
      'serviceType'
    ).controlOptions.options = output;
  }

  getModelCustom(customName: string, selectName: string) {
    this.modelAndListService.getList([customName]).subscribe((data) => {
      const options = Object.entries(data[customName]).map(([key, value]) => ({
        key,
        value,
      }));
      this.getControl(
        0,
        this.pages[0].forms.length - 1,
        selectName
      ).controlOptions.options = options;
    });
  }

  setAppAndServiceType(index?: number) {
    this.getControl(
      0,
      index ? index : this.pages[0].forms.length - 1,
      'serviceType'
    ).valueChanges.subscribe((value: any) => {
      if (value.value !== undefined) {
        if (!this.isDisabled) {
          if (value?.value?.key !== this.serv?.key) {
            Object.keys(
              this.pages[0].forms[
                index ? index : this.pages[0].forms.length - 1
              ].controls
            ).forEach((key) => {
              if (
                key !== 'title' &&
                key !== 'paymentPill' &&
                key !== 'serviceType' &&
                key !== 'Account' &&
                key !== 'applicationType'
              ) {
                this.pages[0].forms[
                  index ? index : this.pages[0].forms.length - 1
                ].removeControl(key);
              }
            });
            this.getControl(
              0,
              index ? index : this.pages[0].forms.length - 1,
              'applicationType'
            ).setValue('');
            this.getAplicationTypes(
              this.getControl(
                0,
                index ? index : this.pages[0].forms.length - 1,
                'serviceType'
              ).value.key
            );
          }
        }
      }
    });
    this.getControl(
      0,
      index ? index : this.pages[0].forms.length - 1,
      'applicationType'
    ).valueChanges.subscribe((value: any) => {
      if (value.value !== undefined) {
        if (!this.isDisabled) {
          if (value?.value?.key !== this.appt?.key) {
            Object.keys(
              this.pages[0].forms[
                index ? index : this.pages[0].forms.length - 1
              ].controls
            ).forEach((key) => {
              if (
                key !== 'title' &&
                key !== 'paymentPill' &&
                key !== 'serviceType' &&
                key !== 'Account' &&
                key !== 'applicationType'
              ) {
                this.pages[0].forms[
                  index ? index : this.pages[0].forms.length - 1
                ].removeControl(key);
              }
            });
            this.getAplicationTypes(
              this.getControl(
                0,
                index ? index : this.pages[0].forms.length - 1,
                'serviceType'
              ).value.key
            );
            this.getControls(
              this.getControl(
                0,
                index ? index : this.pages[0].forms.length - 1,
                'serviceType'
              ).value.key,
              this.getControl(
                0,
                index ? index : this.pages[0].forms.length - 1,
                'applicationType'
              ).value.key
            );
          }
        }
      }
    });
  }

  override onResultChanged(data: FormResult[]) {
    this.endButtons[0].isDisable = !data[0].valid;
    this.endButtons[1].isDisable =
      !data[0].valid || this.alienResponse.length < 1;
  }

  drawPage() {
    this.pages = [];
    this.pages = [new PageModel(1, moiPaymentsForm(), addedForm())];
    this.getControl(0, 0, 'listBoxType').valueChanges.subscribe(
      (value: ValueChangeResult) => {
        this.onTypeChange(value.value);
      }
    );
  }

  onTypeChange(value: any) {
    this.tab = value;

    this.pages[0].deleteFrom(1, this.pages[0].forms.length);
    this.pages[0].addForm(addedForm());
    this.getControl(
      0,
      this.pages[0].forms.length - 1,
      'paymentPill'
    ).controlOptions.text =
      this.tab === 'P'
        ? this.translate.instant('payments.government.pill-payment') + '1'
        : this.translate.instant('payments.government.pill-refund') + '1';
    this.getControl(
      0,
      this.pages[0].forms.length - 1,
      'Account'
    ).controlOptions.options = this.accounts;

    this.combosData['applicationsTypesAllCombosKey'] =
      this.getCombosDatasKeysForApplicationTypes();
    this.getModel(false);

    this.endButtons[0].isDisable = false;
    this.setAppAndServiceType();
    this.endButtons = [this.additionalRefundButton, this.nextButton];
    this.endButtons[1].isDisable = true;

    this.alienResponse = [];
    // this.endButtons[1].isDisable=true
    //
    // this.getModel(true)
  }

  getAccounts() {
    this.accountsService.getSarAccounts().subscribe({
      next: (res) => {
        this.accounts = res.listAlertsPermissionAccount;
        this.getControl(
          0,
          this.pages[0].forms.length - 1,
          'Account'
        ).controlOptions.options = res.listAlertsPermissionAccount;
      },
      error: () => {
        this.nextButton.showLoading = false;
      },
    });
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'Confirm':
        this.nextClick();
        break;
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'Add':
        this.prepareControl();
        break;
      case 'PendingActions':
        void this.router.navigate(['/pendingActions/pending-actions-list']);
        break;
      case 'moiPayments':
        void this.router.navigate(['/payments']);
        break;
      case 'goToDashboard':
        this.setBreadcrumb([]);
        this.router.navigate(['/dashboard']);
        break;
      case 'UserApprovalStatus':
        this.router
          .navigate(['/payments/approval'], {
            queryParams: { type: 'government-payments' },
          })
          .then(() => {});
        break;
      case 'ProcessedTransactions':
        this.router
          .navigate(['/payments/processed'], {
            queryParams: {
              type:
                this.tab === 'P' ? 'government-payments' : 'government-refunds',
            },
          })
          .then(() => {});
        break;
      case 'feedbackFiles':
        void this.router.navigateByUrl(
          '/payments/feedback-files?type=government-payments'
        );
        break;
      case 'delete':
        this.deleteTransfer(formButtonClickOutput.formIndex || 0);
        break;
    }
  }

  deleteTransfer(id: number) {
    this.pages[0].deleteFrom(id, 1);
    this.pages[0].forms.forEach((item: FormModel, index: number) => {
      if (index !== 0)
        item.controls['paymentPill'].controlOptions.text =
          this.tab === 'P'
            ? this.translate.instant('payments.government.pill-payment') + index
            : this.translate.instant('payments.government.pill-refund') + index;
    });
    this.alienResponse.splice(id - 1, 1);
    if (this.pages[0].forms.length < 3) {
      this.endButtons[1].isDisable = true;
    }
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.validateMoiPayments();
        break;
      case 2:
        this.validateResponse.generateChallengeAndOTP
          ? this.showOtp()
          : this.confirmMoiPayments();
        break;
      case 3:
        break;
    }
  }

  showOtp() {
    this.otpService
      .showVerification(this.validateResponse.generateChallengeAndOTP)
      .subscribe((requestValidate: RequestValidate) => {
        this.confirmMoiPayments(requestValidate);
      });
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigate(['/payments']);
        break;
      case 2:
        this.stepperMoveBack();
        this.pageTitle.endButtons = [
          {
            id: 'feedbackFiles',
            type: 'secondary',
            text: 'payments.feedback-files.title',
          },
          this.approvalStatusButton,
          this.proccessTransactionButton,
        ];
        this.endButtons = [this.additionalRefundButton, this.nextButton];
        this.pages[0].forms.slice(0, -1).forEach((element, index) => {
          if (element.id !== 'moiPaymentsForm')
            this.setAppAndServiceType(index);
        });
        break;
      case 3:
        this.stepperMoveBack();
        break;
      case 4:
        this.stepperMoveBack();
        break;
    }
  }

  prepareControl() {
    const sadadPayment: PaymentSadadModel = {
      serviceType: this.getControl(
        0,
        this.pages[0].forms.length - 1,
        'serviceType'
      ).value.key,
      applicationTypeRequest: this.returnRequestSadadPayment(),
    };
    this.govermentPaymentService
      .prepareSadadPayment(sadadPayment)
      .subscribe((res: any) => {
        if (!res.errorCode) {
          this.alienResponse.push(res.batch);
          this.getControl(
            0,
            this.pages[0].forms.length - 1,
            'title'
          ).controlOptions.endButtons = [deleteButton];
          this.addOne(res.batch);
          this.endButtons = [this.additionalRefundButton, this.nextButton];
        }
      });
  }

  validateMoiPayments() {
    this.govermentPaymentService
      .validate(this.returnValidateRequest())
      .subscribe({
        next: (res: any) => {
          this.generateChallengeAndOTP = res.generateChallengeAndOTP;
          this.batchList = res.batchList;
          this.validateResponse = res;
          this.summary = this.fillSummary();
          this.pageTitle.endButtons = [];
          this.stepperMoveNext();
          this.endButtons = [this.confirmButton];
        },
        error: (error: ResponseException) => {
          // this.summary = this.fillSummary();
        },
      });
  }

  confirmMoiPayments(requestValidate?: RequestValidate) {
    this.govermentPaymentService
      .confirm(this.returnConfirmRequest(requestValidate))
      .subscribe({
        next: (res) => {
          this.stepperMoveNext();
          this.summary = {};
          this.result = this.fillSuccessResult();
          this.startButtons = [];
          this.endButtons = !this.showPendingActions
            ? []
            : [this.pendingActionsButton];
          this.endButtons.push(getEndButtons()[0]);
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.summary = {};
          this.result = this.fillErrorResult(
            error.ErrorResponse.errorDescription!
          );
          this.startButtons = [];
          this.endButtons = !this.showPendingActions
            ? []
            : [this.pendingActionsButton];
          this.endButtons.push(getEndButtons()[0]);
        },
      });
  }

  fillSuccessResult(): ResultModal {
    return {
      type: this.validateResponse.batchList.toAuthorize?.length
        ? 'Pending'
        : 'Success',
      title: this.validateResponse.batchList.toAuthorize?.length
        ? 'payments.aramco-payment.peandingAuthMessage'
        : this.tab === 'P'
        ? 'payments.government.paymentSucess'
        : 'payments.government.refundSucess',
      subTitle:
        this.tab === 'P'
          ? 'payments.government.govPayment'
          : 'payments.government.govRefund',
      summary: this.fillSummary(),
    };
  }

  fillErrorResult(errString: string): ResultModal {
    return {
      type: 'Error',
      title: errString,
      summary: this.fillSummary(),
    };
  }

  returnRequestSadadPayment():
    | PrepareAlienControlRequest
    | PrepareCivilDefenseViolationsRequest
    | PrepareCivilRegistrationRequest
    | PrepareDrivingLicenseRequest
    | PrepareMotorVehiclesRequest
    | PreparePublicViolationRequest
    | PrepareSaudiPassportRequest
    | PrepareTrafficViolationsRequest
    | PrepareVisaRegistrationRequest {
    const options: any = {
      applicationType: this.getControl(
        0,
        this.pages[0].forms.length - 1,
        'applicationType'
      ).value.key,
      accountNumber: this.getControl(
        0,
        this.pages[0].forms.length - 1,
        'Account'
      ).value.fullAccountNumber,
      serviceType: this.getControl(
        0,
        this.pages[0].forms.length - 1,
        'serviceType'
      ).value.key,
      borderNumber: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'borderNumber'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'borderNumber')
            .value
        : null,
      visaNumber: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'visaNumber'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'visaNumber').value
        : null,
      numberOfVisas: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'numberOfVisas'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'numberOfVisas')
            .value
        : null,
      sponsorId: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'sponsorId'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'sponsorId').value
        : null,
      iqamaId: this.controlExist(0, this.pages[0].forms.length - 1, 'iqamaId')
        ? this.getControl(0, this.pages[0].forms.length - 1, 'iqamaId').value
        : null,
      violatorId: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'violatorId'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'violatorId').value
        : null,
      issuingEntity: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'issuingEntity'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'issuingEntity')
            .value.key
        : null,
      category: this.controlExist(0, this.pages[0].forms.length - 1, 'category')
        ? this.getControl(0, this.pages[0].forms.length - 1, 'category').value
            .key
        : null,
      transactionType: this.getControl(0, 0, 'listBoxType').value,
      householdIdNumber: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'householdIdNumber'
      )
        ? this.getControl(
            0,
            this.pages[0].forms.length - 1,
            'householdIdNumber'
          ).value
        : null,
      numberDependant: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'numberDependant'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'numberDependant')
            .value
        : null,
      citizenId: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'citizenId'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'citizenId').value
        : null,
      iqamaDuration: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'iqamaDuration'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'iqamaDuration')
            .value.key
        : null,
      jobCategory: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'jobCategory'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'jobCategory')
            .value.key
        : null,
      visaDuration: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'visaDuration'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'visaDuration')
            .value.key
        : null,
      // day: this.controlExist(0, 1, "day") ? this.getControl(0, 1, "day").value : null,
      // month: this.controlExist(0, 1, "month") ? this.getControl(0, 1, "month").value : null,
      // year: this.controlExist(0, 1, "year") ? this.getControl(0, 1, "year").value : null,
      associatedBorderNumber: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'associatedBorderNumber'
      )
        ? this.getControl(
            0,
            this.pages[0].forms.length - 1,
            'associatedBorderNumber'
          ).value
        : null,
      veredictNumber: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'veredictNumber'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'veredictNumber')
            .value
        : null,
      nationalIdNumber: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'nationalIdNumber'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'nationalIdNumber')
            .value
        : null,
      issuanceReason: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'issuanceReason'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'issuanceReason')
            .value.key
        : null,
      cardVersionNumber: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'cardVersionNumber'
      )
        ? this.getControl(
            0,
            this.pages[0].forms.length - 1,
            'cardVersionNumber'
          ).value
        : null,
      beneficiaryId: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'beneficiaryId'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'beneficiaryId')
            .value
        : null,
      licenseType: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'licenseType'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'licenseType')
            .value.key
        : null,
      licenseDuration: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'licenseDuration'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'licenseDuration')
            .value.key
        : null,
      currentOwnerId: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'currentOwnerId'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'currentOwnerId')
            .value
        : null,
      vehicleSequenceNumber: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'vehicleSequenceNumber'
      )
        ? this.getControl(
            0,
            this.pages[0].forms.length - 1,
            'vehicleSequenceNumber'
          ).value
        : null,
      newOwnerId: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'newOwnerId'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'newOwnerId').value
        : null,
      reason: this.controlExist(0, this.pages[0].forms.length - 1, 'reason')
        ? this.getControl(0, this.pages[0].forms.length - 1, 'reason').value.key
        : null,
      vehicleCustomCardNumber: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'vehicleCustomCardNumber'
      )
        ? this.getControl(
            0,
            this.pages[0].forms.length - 1,
            'vehicleCustomCardNumber'
          ).value
        : null,
      newVehicleRegistrationType: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'newVehicleRegistrationType'
      )
        ? this.getControl(
            0,
            this.pages[0].forms.length - 1,
            'newVehicleRegistrationType'
          ).value.key
        : null,
      vehicleBodyType: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'vehicleBodyType'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'vehicleBodyType')
            .value.key
        : null,
      licensePlateWithLogo: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'licensePlateWithLogo'
      )
        ? this.getControl(
            0,
            this.pages[0].forms.length - 1,
            'licensePlateWithLogo'
          ).value.key
        : null,
      passportType: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'passportType'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'passportType')
            .value.key
        : null,
      passportDuration: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'passportDuration'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'passportDuration')
            .value.key
        : null,
      violationId: this.controlExist(
        0,
        this.pages[0].forms.length - 1,
        'violationId'
      )
        ? this.getControl(0, this.pages[0].forms.length - 1, 'violationId')
            .value
        : null,
      visaType: this.controlExist(0, this.pages[0].forms.length - 1, 'visaType')
        ? this.getControl(0, this.pages[0].forms.length - 1, 'visaType').value
            .key
        : null,
    };
    Object.keys(options).forEach((key) => {
      if (options[key] === null) delete options[key];
    });
    return options;
  }

  returnValidateRequest(): ValidateRequest {
    return {
      batchList: this.alienResponse,
    };
  }

  returnConfirmRequest(requestValidate?: RequestValidate): ConfirmRequest {
    return {
      batchList: this.batchList,
      requestValidate: requestValidate,
    };
  }

  getCombosDatasKeysForApplicationTypes(): any {
    return {
      '': 'eGovApplicationTypeAll', // All
      '095': 'eGovLaborImportationApp', //"VisaService",
      '092': 'eGovSaudiPassportsApp', //"SaudiPassport",
      '091': 'eGovDrivingLicenseApp', //"DrivingLicense",
      '096': 'eGovCivilRegistrationApp', //"CivilRegistration",
      '158': 'eGovCivilDefenseViolationsApp', //"CivilDefenseViolations",
      '090': 'eGovAlienControlApp', //"AlienControl",
      '094': 'eGovMotorVehiclesApp', //"MotorVehicles",
      '093': 'eGovTrafficViolationsApp', //"TrafficViolations"
      '126': 'eGovNationalViolationsApp', //"TrafficViolations"
    };
  }

  addOne(batch: any) {
    this.serv = this.getControl(
      0,
      this.pages[0].forms.length - 1,
      'serviceType'
    ).value;
    this.appt = this.getControl(
      0,
      this.pages[0].forms.length - 1,
      'applicationType'
    ).value;
    if (this.tab === 'P')
      this.pages[0].forms[this.pages[0].forms.length - 1].addControl(
        'amount',
        new AmountControl({
          label: 'public.amount',
          order: 100,
          disable: true,
          hidden: false,
          value: batch.amount,
          controlOptions: {
            currency: '608',
          },
          columnCount: 4,
        })
      );

    this.isDisabled = true;
    this.pages[0].forms[this.pages[0].forms.length - 1].disableControls();
    this.isDisabled = false;

    this.pages[0].addForm(addedForm());

    this.resetForm();
    const index: number = this.alienResponse.length + 1;
    this.getControl(0, index, 'paymentPill').controlOptions.text =
      this.tab === 'P'
        ? this.translate.instant('payments.government.pill-payment') + index
        : this.translate.instant('payments.government.pill-refund') + index;
    this.serv = {
      key: '',
      value: '',
      displayText: '',
      selected: false,
    };

    this.appt = {
      key: '',
      value: '',
      displayText: '',
      selected: false,
    };
  }

  resetForm() {
    this.getControl(
      0,
      this.pages[0].forms.length - 1,
      'paymentPill'
    ).controlOptions.text =
      this.tab === 'P'
        ? this.translate.instant('payments.government.pill-payment') + '1'
        : this.translate.instant('payments.government.pill-refund') + '1';
    this.getControl(
      0,
      this.pages[0].forms.length - 1,
      'Account'
    ).controlOptions.options = this.accounts;
    this.setServiceType();
    this.setAppAndServiceType();
  }

  getControls(serviceType: string, applicationType: string, index?: number) {
    const controls =
      this.tab === 'P'
        ? MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[serviceType].applicationsTypes[
            applicationType
          ].controls
        : MOI_REFUNDS_FORMS_FIELDS_CONFIGS[serviceType].applicationsTypes[
            applicationType
          ].controls;
    controls.forEach((item: any, index: number) => {
      switch (item.type) {
        case 'select':
          this.pages[0].forms[
            index ? index : this.pages[0].forms.length - 1
          ].addControl(
            item.key,
            new DropdownControl({
              label: item.label,
              required: item.required,
              controlOptions: {
                columnId: 'key',
                textField: 'value',
                options: Object.entries(
                  this.dropsData[item.select_combo_key]
                ).map(([key, value]) => ({ key, value })),
              },
              validators: item.validators,
              validationLabels: item.validationLabels,
              hidden: item.hidden,
            })
          );
          break;
        case 'select-dep':
          this.getControl(
            0,
            index ? index : this.pages[0].forms.length - 1,
            item.select_parent
          ).valueChanges.subscribe((value) => {
            this.getModelCustom(
              item.select_combo_key_by_parent_value + '' + value.value.key,
              item.key
            );
          });
          this.pages[0].forms[
            index ? index : this.pages[0].forms.length - 1
          ].addControl(
            item.key,
            new DropdownControl({
              label: item.label,
              required: item.required,
              controlOptions: {
                columnId: 'key',
                textField: 'value',
                options: [],
              },
              validators: item.validators,
              validationLabels: item.validationLabels,
              hidden: item.hidden,
            })
          );

          break;
        case 'date':
          this.pages[0].forms[
            index ? index : this.pages[0].forms.length - 1
          ].addControl(
            item.key,
            new DateControl({
              label: item.label,
              required: item.required,
              value: '',
              validators: item.validators,
              validationLabels: item.validationLabels,
            })
          );
          break;
        case 'number':
          this.pages[0].forms[
            index ? index : this.pages[0].forms.length - 1
          ].addControl(item.key, new NumberInputControl(item));
          break;
        default:
          this.pages[0].forms[
            index ? index : this.pages[0].forms.length - 1
          ].addControl(item.key, new TextInputControl(item));
          break;
      }
    });
  }

  getAplicationTypes(serviceType: string) {
    const applicationType = Object.entries(
      this.tab === 'P'
        ? MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[serviceType].applicationsTypes
        : MOI_REFUNDS_FORMS_FIELDS_CONFIGS[serviceType].applicationsTypes
    ).map((key: any) => {
      return { key: key[1].key, value: key[1].title };
    });
    this.getControl(
      0,
      this.pages[0].forms.length - 1,
      'applicationType'
    ).controlOptions.options = applicationType;
  }

  getData(): any {
    let serviceType: '';
    if (this.dropsData) {
      serviceType =
        this.tab === 'P'
          ? this.dropsData.eGovSadadType
          : this.dropsData.eGovSadadRType;
    } else {
      serviceType = '';
    }
    return serviceType;
  }

  fillSummary(): SummaryModel {
    let sections: SummarySectionModel[] = [];
    if (this.batchList) {
      const objPayments: any = {};
      const objRefunds: any = {};

      this.modelAndListService
        .getList(this.tab === 'P' ? SelectionTypeNamesP : SelectionTypeNamesR)
        .subscribe((data) => {
          delete data[this.tab === 'P' ? 'eGovSadadType' : 'eGovSadadRType'][
            '000'
          ];
          this.dropsData = data;

          for (const key in MOI_PAYMENTS_FORMS_FIELDS_CONFIGS) {
            const value = MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[key];
            for (const key in value.applicationsTypes) {
              const ob = value.applicationsTypes[key];
              objPayments[key] = ob.title;
            }
          }

          for (const key in MOI_REFUNDS_FORMS_FIELDS_CONFIGS) {
            const value = MOI_REFUNDS_FORMS_FIELDS_CONFIGS[key];
            for (const key in value.applicationsTypes) {
              const ob = value.applicationsTypes[key];
              objRefunds[key] = ob.title;
            }
          }
        });

      if (this.batchList.toProcess.length > 0) {
        this.batchList.toProcess.forEach((item, index) => {
          sections.push({
            pill: {
              text:
                this.tab === 'P'
                  ? this.translate.instant('payments.government.pill-payment') +
                    (index + 1)
                  : this.translate.instant('payments.government.pill-refund') +
                    (index + 1),
              type: 'Neutral',
            },
            title: {
              id: 'MOISummaryProcessTitle' + (index + 1),
              title: 'payments.government.moiToProcess',
              startButtons: [],
            },
            items: [
              {
                title: 'payments.application-type',
                subTitle:
                  this.tab === 'P'
                    ? objPayments[item.applicationType]
                    : objRefunds[item.applicationType],
              },
              {
                title: 'payments.service-type',
                subTitle: this.getData()[item.serviceType],
              },
              {
                title: 'public.account',
                subTitle: item.accountNumber,
              },
              {
                title: 'payments.unused-balance',
                subTitle: item.unusedBalance?.toString(),
              },
              {
                title: 'payments.amount',
                subTitle: item.amount?.toString(),
              },
              {
                title: 'payments.beneficiary-name',
                subTitle: item.beneficiaryName,
              },
            ],
          });
          sections[index].items?.push(
            Utils.getCurrentLevelSummaryItem(
              this.translate,
              item?.futureSecurityLevelsDTOList
            )
          );
        });
      }
      if (this.batchList.toAuthorize?.length) {
        this.batchList.toAuthorize.forEach((item, index) => {
          sections.push({
            pill: {
              text:
                this.tab === 'P'
                  ? this.translate.instant('payments.government.pill-payment') +
                    (index + 1)
                  : this.translate.instant('payments.government.pill-refund') +
                    (index + 1),
              type: 'Neutral',
            },
            title: {
              id: 'MOISummaryAuthorizeTitle' + (index + 1),
              title: 'payments.government.moiToAuthorize',
              startButtons: [],
            },
            items: [
              {
                title: 'payments.application-type',
                subTitle:
                  this.tab === 'P'
                    ? objPayments[item.applicationType]
                    : objRefunds[item.applicationType],
              },
              {
                title: 'payments.service-type',
                subTitle: this.getData()[item.serviceType],
              },
              {
                title: 'public.account',
                subTitle: item.accountNumber,
              },
              {
                title: 'payments.unused-balance',
                subTitle: item.unusedBalance?.toString(),
              },
              {
                title: 'payments.beneficiary-name',
                subTitle: item.beneficiaryName,
              },
            ],
          });
          sections[index].items?.push(
            Utils.getCurrentLevelSummaryItem(
              this.translate,
              item?.futureSecurityLevelsDTOList
            )
          );
          sections[index].items?.push(
            Utils.getNextLevelSummaryItem(
              this.translate,
              item?.futureSecurityLevelsDTOList
            )
          );
        });
      }
      if (this.batchList.notAllowed.length > 0) {
        this.batchList.notAllowed.forEach((item, index) => {
          sections.push({
            pill: {
              text:
                this.tab === 'P'
                  ? this.translate.instant('payments.government.pill-payment') +
                    (index + 1)
                  : this.translate.instant('payments.government.pill-refund') +
                    (index + 1),
              type: 'Neutral',
            },
            title: {
              id: 'MOISummaryNotAlloedTitle' + (index + 1),
              title: 'payments.government.moiNotAllowed',
              startButtons: [],
            },
            items: [
              {
                title: 'payments.application-type',
                subTitle:
                  this.tab === 'P'
                    ? objPayments[item.applicationType]
                    : objRefunds[item.applicationType],
              },
              {
                title: 'payments.service-type',
                subTitle: this.getData()[item.serviceType],
              },
              {
                title: 'public.account',
                subTitle: item.accountNumber,
              },
              {
                title: 'payments.unused-balance',
                subTitle: item.unusedBalance?.toString(),
              },
              {
                title: 'payments.beneficiary-name',
                subTitle: item.beneficiaryName,
              },
            ],
          });
        });
      }
    }
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
      },
      sections: sections,
    };
  }
}
