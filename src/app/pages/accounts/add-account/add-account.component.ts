import { Component } from '@angular/core';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { PopupOutputModel } from 'app/@core/model/dto/popup.model';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import {
  BranchDTO,
  CreateAccountReq,
  CreateAccountRes,
} from 'app/@core/model/rest/accounts/add-account-req';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import {
  GenerateChallengeAndOTP,
  RequestValidate,
} from 'app/@core/model/rest/common/otp.model';
import { AccountsService } from 'app/@core/service/accounts/accounts.service';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { PopupService } from 'app/@core/service/base/popup.service';
import { ResponseException } from 'app/@core/service/base/responseException';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { Utils } from 'app/@core/utility/Utils';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { TransactionFollowBase } from 'app/shared/transaction-follow-base/transaction-follow-base';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import {
  accessForm,
  addAccForm,
  getEndButtons,
  submitButton,
} from './add-account-controls';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: [],
})
export class AddAccountComponent extends TransactionFollowBase {
  generateChallengeAndOTP!: GenerateChallengeAndOTP;
  currencyList!: KeyValueModel[];
  selectedBranch!: BranchDTO;
  constructor(
    private accountsService: AccountsService,
    private popupService: PopupService,
    private modelAndListService: ModelAndListService,
    private otpService: VerificationService
  ) {
    super();

    this.pageTitle = {
      id: 'addAccount',
      title: 'accounts.open-new-acc',
      stepper: {
        steps: ['', '', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
    };

    this.setBreadcrumb([
      {
        text: 'accounts.acc',
        url: '/accounts',
      },
      {
        text: 'accounts.open-new-acc',
        url: '/accounts/add-account',
      },
    ]);

    this.accountsService.getEligibilityInquiry().subscribe({
      next: (response) => {
        if (response.eligibilityFlg) {
          this.selectedBranch = response.branch;
          this.drawPage();
        } else {
          this.forbidden();
        }
      },
      error: () => {},
    });
  }

  forbidden(): void {
    const popupContent = {
      form: accessForm(),
      image: 'assets/img/warning.svg',
    };

    this.popupService
      .showPopup(popupContent)
      .subscribe((res: PopupOutputModel) => {
        this.popupService.dismiss();
        this.router.navigate(['/accounts']);
      });
  }

  drawPage(): void {
    this.modelAndListService.getList(['openAccountCurrencyCodes']).subscribe({
      next: (models) => {
        this.currencyList = Utils.getModelList(models.openAccountCurrencyCodes);

        let displayedText: string;
        if (this.translate.currentLang === 'en') {
          displayedText = this.selectedBranch.branchNameEn;
        } else {
          displayedText = this.selectedBranch.branchName;
        }

        this.pages = [];
        this.pages = [
          new PageModel(
            1,
            addAccForm(this.currencyList, [
              {
                key: this.selectedBranch.branchRbs5,
                value: displayedText,
              },
            ])
          ),
        ];

        this.getControl(0, 0, 'branch').setValue({
          displayText: displayedText,
          key: this.selectedBranch.branchRbs5,
          selected: true,
          value: displayedText,
        });
      },
    });
  }

  override onResultChanged(data: FormResult[]) {
    this.endButtons[0].isDisable = !data[0].valid;
  }

  returnRequestCreateAccount(otp?: string): CreateAccountReq {
    const payload: CreateAccountReq = {
      acctType: 'CUR',
      branchIdent: this.getControl(0, 0, 'branch').value.key,
      currency: this.getControl(0, 0, 'currency').value.key,
    };

    if (otp) {
      payload.requestValidate = { otp: otp };
    }
    return payload;
  }

  showOtp(): void {
    this.otpService
      .showVerification(this.generateChallengeAndOTP)
      .subscribe((res: RequestValidate) => {
        this.confirmAccount(res.otp);
      });
  }

  validateAccount(): void {
    this.accountsService
      .validateAccount(this.returnRequestCreateAccount())
      .subscribe({
        next: (res: CreateAccountRes) => {
          this.generateChallengeAndOTP = res.generateChallengeAndOTP;
          this.summary = this.fillSummary();
          this.stepperMoveNext();
          this.endButtons = [submitButton];
        },
        error: (error: ResponseException) => {},
      });
  }

  confirmAccount(otp?: string): void {
    this.nextButton.showLoading = true;
    this.accountsService
      .confirmAccount(this.returnRequestCreateAccount(otp))
      .subscribe({
        next: (res: CreateAccountRes) => {
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

  backClick(): void {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigate(['/accounts']);
        break;
      case 2:
        this.endButtons = [this.nextButton];
        this.stepperMoveBack();
        break;
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'terms-link':
        let file = 'subaccount_new_terms_and_conditions.pdf';
        this.accountsService.getTermsCond(file);
        break;
      case 'Next':
        this.validateAccount();
        break;
      case 'Submit':
        this.generateChallengeAndOTP &&
        this.generateChallengeAndOTP.typeAuthentication
          ? this.showOtp()
          : this.confirmAccount();
        break;
      case 'Back':
        this.backClick();
        break;
      case 'goToAccounts':
        this.pages = [];
        this.router.navigate(['/accounts']);
        break;
    }
  }

  fillSummary(): SummaryModel {
    return {
      sections: [
        {
          title: {
            id: 'serviceType',
            title: 'public.summary',
          },
          items: [
            {
              title: 'accounts.add.service-type',
              subTitle: 'accounts.open-new-acc',
            },
          ],
        },
        {
          title: {
            id: 'details',
            title: 'public.details',
          },
          items: [
            {
              title: 'accounts.currency',
              subTitle: this.getControl(0, 0, 'currency').value.displayText,
            },
            {
              title: 'accounts.branch',
              subTitle: this.getControl(0, 0, 'branch').value.displayText,
            },
          ],
        },
      ],
    };
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'accounts.add.success',
      subTitle:
        'accounts.add.appointment' +
        this.getControl(0, 0, 'branch').value.displayText,
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
}
