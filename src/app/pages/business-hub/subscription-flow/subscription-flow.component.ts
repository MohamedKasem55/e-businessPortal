import { Component } from '@angular/core';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { AccountsReq } from 'app/@core/model/rest/accounts/accounts-req';
import { InitRegistrationRes, RegisterNewQOYODReq, RegisterNewZIDReq } from 'app/@core/model/rest/business-hub/business-hub-req.model';
import { GenerateChallengeAndOTP } from 'app/@core/model/rest/common/otp.model';
import { AccountsCommonService } from 'app/@core/service/accounts/accounts-common.service';
import { ResponseException } from 'app/@core/service/base/responseException';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { BusinessHubService } from 'app/@core/service/business-hub/business-hub.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { TransactionFollowBase } from 'app/shared/transaction-follow-base/transaction-follow-base';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { getEndButtons, getSubscriptionForm } from './subscription-flow-controls';

@Component({
  selector: 'app-subscription-flow',
  templateUrl: './subscription-flow.component.html',
  styleUrls: ['./subscription-flow.component.scss']
})
export class SubscriptionFlowComponent
  extends TransactionFollowBase {
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  feature!: string;
  constructor(
    private accountsCommonService: AccountsCommonService,
    private businessHubService: BusinessHubService,
    private otpService: VerificationService,
  ) {
    super();
    this.feature = history.state.id;
    this.setBreadCrumb();
    this.pageTitle = {
      id: "subscriptionTitle",
      title: "businessHub.subscribe",
      stepper: {
        steps: ["", "", ""],
        stepCounter: 1,
        stepText: "public.step",
        ofText: "public.of"
      }
    };
    this.pages = [new PageModel(1, getSubscriptionForm())];
    this.setAccountsNumber();
    this.setFormData();
  }


  setAccountsNumber() {
    let accountsReq: AccountsReq = {
      order: "",
      orderType: "",
      page: 1,
      rows: null,
      txType: "ECAL"
    };
    this.accountsCommonService.getAllEligibleAccounts(accountsReq).subscribe(response => {
      this.getControl(0, 0, 'accountsControl').controlOptions.options = response.listAccount;
    });
  }

  setBreadCrumb() {
    this.breadcrumbService.setBreadcrumb([
      {
        text: 'businessHub.businessHubTitle',
        url: '/business-hub'
      },
      {
        text: <string>sessionStorage.getItem('subscriptionProductDetailsTitle'),
        url: '/business-hub/details'
      },
      {
        text: 'businessHub.subscribe',
        url: ''
      }
    ]);
  }

  showOtp(): void {
    this.otpService
      .showVerification(this.generateChallengeAndOTP)
      .subscribe(() => {
        this.confirmSubscription();
      });
  }

  fillSummary(isSuccessScreen: boolean): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'subscriptionSummary',
            title: 'businessHub.information-details',
          },
          items: [
            {
              title: 'businessHub.full-name',
              subTitle: this.getControl(0, 0, 'nameControl').value,
            },
            {
              title: 'public.email',
              subTitle: this.getControl(0, 0, 'emailControl').value,
            },
            {
              title: 'businessHub.phoneNum',
              subTitle: this.getControl(0, 0, 'phoneControl').value,
            },
            {
              title: 'businessHub.companyName',
              subTitle: this.getControl(0, 0, 'companyNameControl').value,
            },
          ],
        },
        {
          title: {
            id: 'subscriptionSummary',
            title: 'businessHub.selectAccount',
            startButtons: !isSuccessScreen ? [this.editButton] : [],
          },
          items: [
            {
              title: 'businessHub.selectAccount',
              subTitle: this.getControl(0, 0, 'accountsControl').value[
                'displayText'
              ],
            },
          ],
        },
      ],
    };
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'businessHub.success-subscription',
      subTitle: 'businessHub.success-subscription-subTitle',
      summary: this.fillSummary(true),
    };
  }

  fillErrorResult(errString?: string): ResultModal {
    return {
      type: 'Error',
      title: errString || '',
      summary: this.fillSummary(true),
    };
  }

  setFormData() {
    this.businessHubService.getOwnerDetails().subscribe(response => {
      this.getControl(0, 0, 'nameControl').setValue(response?.companyOwnerName);
      this.getControl(0, 0, 'phoneControl').setValue(response?.companyOwnerMobileNumber);
      this.getControl(0, 0, 'emailControl').setValue(JSON.parse(<string>sessionStorage.getItem('user'))?.email,);
      this.getControl(0, 0, 'companyNameControl').setValue(JSON.parse(<string>sessionStorage.getItem('company'))?.companyName);
    });
  }

  onConfirmClick() {
    this.businessHubService.initRegistration(this.feature).subscribe({
      next: (res: InitRegistrationRes) => {
        this.generateChallengeAndOTP = res.generateChallengeAndOTP;
        this.generateChallengeAndOTP && this.generateChallengeAndOTP.typeAuthentication
          ? this.showOtp()
          : this.confirmSubscription();
      },
      error: (error: ResponseException) => { },
    });
  }
  confirmSubscription(otp?: string) {
    this.nextButton.showLoading = true;
    this.businessHubService
      .registerNew(
        this.feature,
        this.returnRequestRegisterNew(this.feature, otp)
      )
      .subscribe({
        next: (res) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.endButtons = getEndButtons();
          this.summary = {};
          this.result = this.fillSuccessResult();
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.startButtons = [];
          this.endButtons = getEndButtons();
          this.summary = {};
          this.result = this.fillErrorResult(
            error.ErrorResponse.errorDescription!
          );
        },
      });
  }
  returnRequestRegisterNew(
    feature: string,
    otp?: string
  ): RegisterNewZIDReq | RegisterNewQOYODReq {
    const payload =
      feature === 'zid'
        ? ({
          storeUsername: this.getControl(0, 0, 'companyNameControl').value,
          fromAcct: this.getControl(0, 0, 'accountsControl').value
            .fullAccountNumber,
          name: this.getControl(0, 0, 'nameControl').value,
          email: this.getControl(0, 0, 'emailControl').value,
          mobile: this.getControl(0, 0, 'phoneControl').value,
        } as RegisterNewZIDReq)
        : ({
          organizationName: this.getControl(0, 0, 'companyNameControl').value,
          fromAcct: this.getControl(0, 0, 'accountsControl').value
            .fullAccountNumber,
          user: {
            firstName: this.getControl(0, 0, 'nameControl').value.split(
              ' '
            )[0],
            lastName: this.getControl(0, 0, 'nameControl').value.split(' ')[
              this.getControl(0, 0, 'nameControl').value.split(' ').length - 1
            ],
            email: this.getControl(0, 0, 'emailControl').value,
            mobileContact: this.getControl(0, 0, 'phoneControl').value,
          },
        } as RegisterNewQOYODReq);
    if (otp) {
      payload.requestValidate = { otp: otp };
    }
    return payload;
  }

  // event listeners
  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'Confirm':
        this.onConfirmClick();
        break;
      case 'businessHubBtn':
        this.router.navigate(['/business-hub']);
        break;
      case 'dashboardBtn':
        this.router.navigate(['/dashboard']);
        break;
      case 'terms':
        this.businessHubService.getDocument(`terms_and_conditions_business_hub_${this.translate.currentLang}.pdf`);
        break;
      default:
        break;
    }
  }

  nextClick() {
    this.summary = this.fillSummary(false);
    this.stepperMoveNext();
    this.endButtons = [this.confirmButton];
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigate(['/business-hub/details']);
        break;
      case 2:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton];
        break;
      case 3:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton];
        break;
    }
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach(item => {
      valid = valid && item.valid;
    })
    this.endButtons[0].isDisable = !valid;
  }

}
