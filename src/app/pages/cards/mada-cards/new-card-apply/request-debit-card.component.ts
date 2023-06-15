import { Component, OnInit } from '@angular/core';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { Account } from 'app/@core/model/rest/common/account';
import { UserProfileService } from 'app/@core/service/user-profile/user-profile.service';
import { take } from 'rxjs';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import {
  selectAccountForm,
  editAccoutButton,
  branchForm,
} from './request-debit-card-controls';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { ModelAndListService } from 'app/@core/service/base/modelAndList.service';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import { ResponseException } from 'app/@core/service/base/responseException';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { FormButtonClickOutput } from '../../../../shared/form/form.component';
import { DebitCardsService } from 'app/@core/service/cards/debit-cards/debit-cards.service';
import {
  BranchesOfCityReqeust,
  DebitCardApplyNewCardInitRes,
  DebitCardConfirmApplyNewCardRequest,
  DebitCardValidateApplyNewCardRes,
} from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import { Utils } from 'app/@core/utility/Utils';
import { ActivatedRoute } from '@angular/router';
import {
  APPLY_NEW_CARD,
  CARDS,
} from 'app/@core/constants/pages-urls-constants';
import { ButtonModel } from 'arb-design-library/model/button.model';

@Component({
  selector: 'app-request-debit-card',
  templateUrl: '../../cards-base/cards-base.component.html',
})
export class RequestDebitCardComponent
  extends CardsBaseComponent
  implements OnInit
{
  accountsList: Account[] = [];
  citiesList: KeyValueModel[] = [];
  branchesList: KeyValueModel[] = [];
  selectedAccount: any;
  birthDate!: any;
  validateResponse!: DebitCardValidateApplyNewCardRes;
  embossingNamesList: KeyValueModel[] | undefined;
  cities: KeyValueModel[] | undefined;
  debitState!: DebitCardApplyNewCardInitRes;

  goApplyButton: ButtonModel = {
    id: "goApply",
    text: 'cards.new-card.goToApply',
    type: "primary",
    isDisable: false
  };

  constructor(
    private debitCardService: DebitCardsService,
    private activatedRoute: ActivatedRoute,
    private modelAndListService: ModelAndListService,
    private otpService: VerificationService
  ) {
    super();
    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: '/cards',
      },
      { text: 'cards.new-card.new-card', url: '' },
    ]);
  }

  override ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ debitState }) => {
      this.debitState = debitState;
      this.pages = [new PageModel(0, selectAccountForm(), branchForm())];
      this.fillAcountsAndEmbossingNames();
      this.loadAllCititesOfBranches();
      this.initiatPage();
    });
  }

  initiatPage() {
    this.pageTitle.id = 'newCardTitle';
    this.pageTitle.title = 'cards.new-card.apply-for-card';
    this.pageTitle.stepper!.steps = ['', '', ''];
    this.endButtons[0].isDisable = true;

    this.registerChangeValueEvents();
  }

  registerChangeValueEvents() {
    this.getControl(0, 1, 'city').valueChanges.subscribe(
      (formValueChangeModel: any) => {
        this.cityChangeListener(formValueChangeModel.value.key);
      }
    );
  }

  cityChangeListener(value: string) {
    this.loadBranches(value);
  }

  fillAcountsAndEmbossingNames() {
    this.accountsList = this.debitState.accounts;
    this.embossingNamesList = this.debitState.embossingNames.map((name) => {
      let item: KeyValueModel = {
        key: name,
        value: name,
      };
      return item;
    });

    this.assignDropdownListFieldValues(
      'linkedAccount',
      0,
      0,
      this.accountsList,
      {
        textField: 'fullAccountNumber',
        endTextField: 'availableBalance',
      }
    );

    this.assignDropdownListFieldValues(
      'embosingNames',
      0,
      0,
      this.embossingNamesList,
      {
        textField: 'key',
      }
    );
  }

  loadAllCititesOfBranches() {
    this.modelAndListService
      .getModel('allCititesOfBranches')
      .pipe(take(1))
      .subscribe((res) => {
        this.cities = Utils.getModelList(res.allCititesOfBranches);
        this.assignDropdownListFieldValues('city', 0, 1, this.cities, {
          columnId: 'key',
          textField: 'value',
        });
      });
  }

  loadBranches(city: string) {
    let req: BranchesOfCityReqeust = {
      key: city,
    };
    this.debitCardService.getAllBranchesOfCity(req).subscribe({
      next: (res) => {
        this.branchesList = Utils.getModelList(res.props);

        this.assignDropdownListFieldValues('branch', 0, 1, this.branchesList, {
          columnId: 'key',
          textField: 'value',
        });
      },
    });
  }

  override onResultChanged(forms: FormResult[]): void {
    let isTermsAccepted = this.getControl(0, 0, 'terms').value;
    let valid = true;
    forms.forEach((form) => {
      valid = valid && form.valid && isTermsAccepted;
    });
    this.endButtons[0].isDisable = !valid;

    if (!forms[0].valid) {
      this.getControl(0, 1, 'pickupOffice').hidden = true;
      this.getControl(0, 1, 'city').hidden = true;
      this.getControl(0, 1, 'branch').hidden = true;
    } else {
      this.getControl(0, 1, 'pickupOffice').hidden = false;
      this.getControl(0, 1, 'city').hidden = false;
      this.getControl(0, 1, 'branch').hidden = false;
    }
  }

  handleBack() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.location.back();
        break;
      case 2:
        this.stepperMoveBack();
        this.fillSummary();
        this.endButtons = [this.nextButton];
        break;
    }
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case 'terms-link':
        let file = 'SME-Debit-Card-TC-v-16-EN.pdf';
        if (this.translate.currentLang == 'ar') {
          file = 'SME-Debit-Card-TC-v-16-AR.pdf';
        }
        this.debitCardService.getDocument(file);
        break;
      case 'Next':
        this.goToSummary();
        break;
      case 'Back':
        this.handleBack();
        break;
      case 'Edit':
        this.backClick();
        break;
      case 'edit-account-btn':
        if (this.pageTitle?.stepper?.stepCounter! > 1) {
          this.hidePickupSection();
          this.backClick();
        }

        break;
      case 'Confirm':
        this.requestValidateOTP();
        break;
      case this.backToCardsButton.id:
        this.router.navigate(['/cards']);
        break;
      case this.backToDashboardButton.id:
        this.router.navigate(['/dashboard']);
        break;
      case this.goApplyButton.id:
          this.router.navigate(['/cards/apply-new-card']);
          break;
    }
  }

  hidePickupSection() {
    this.getControl(0, 0, 'linkedAccount').setValue('');
    this.getControl(0, 0, 'embosingNames').setValue('');

    this.getControl(0, 1, 'pickupOffice').hidden = true;
    this.getControl(0, 1, 'city').hidden = true;
    this.getControl(0, 1, 'branch').hidden = true;
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.router.navigate([`/${CARDS}/${APPLY_NEW_CARD}`]);
        break;
      case 2:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton];
        break;
    }
  }

  goToSummary() {
    this.summary = this.fillSummary();
    this.stepperMoveNext();
    this.endButtons = [this.confirmButton];
  }

  fillSummary(enableEditButton = true): SummaryModel {
    const linkedAccount = this.getControl(0, 0, 'linkedAccount').value
      .fullAccountNumber;

    const embosingName = this.getControl(0, 0, 'embosingNames').value.value;

    const city: string = this.getControl(
      0,
      1,
      'city'
    ).value?.displayText?.trim();

    const branch: string = this.getControl(
      0,
      1,
      'branch'
    ).value?.displayText?.trim();

    let sections = [
      {
        title: {
          id: 'card-details',
          title: 'cards.new-card.card-details',
          endButtons: enableEditButton ? [editAccoutButton] : [],
        },
        items: [
          {
            title: 'cards.new-card.linked-account',
            subTitle: linkedAccount,
          },
          {
            title: 'cards.new-card.embossing-name',
            subTitle: embosingName,
          },
        ],
      },
      {
        title: {
          id: 'pick-up-office',
          title: 'cards.new-card.pick-up-office',
          endButtons: enableEditButton ? [this.editButton] : [],
        },
        items: [
          {
            title: 'cards.new-card.pick-up-city',
            subTitle: city,
          },
          {
            title: 'cards.new-card.pick-up-branch',
            subTitle: branch,
          },
        ],
      },
    ];
    let summary: SummaryModel = {
      sections: sections,
    };
    return summary;
  }



  requestValidateOTP() {
    this.debitCardService
      .validateDebitApplyNewCard()
      .pipe(take(1))
      .subscribe((res) => {
        if (res?.generateChallengeAndOTP) {
          this.validateResponse = res;
          this.showOtp();
        }
      });
  }

  showOtp() {
    this.otpService
      .showVerification(this.validateResponse.generateChallengeAndOTP)
      .subscribe((requestValidate: RequestValidate) => {
        this.confirmNewCardRequest(requestValidate);
      });
  }

  confirmNewCardRequest(requestValidate: RequestValidate) {
    const linkedAccount = this.getControl(0, 0, 'linkedAccount').value
      .fullAccountNumber;

    const embosingName = this.getControl(0, 0, 'embosingNames').value.value;

    const branch: string = this.getControl(0, 1, 'branch').value?.value?.trim();

    const request: DebitCardConfirmApplyNewCardRequest = {
      accountNumber: linkedAccount,
      branchId: branch,
      embossingName: embosingName,
      gender: this.debitState.gender,
      requestValidate: requestValidate,
    };
    this.debitCardService
      .confirmDebitApplyNewCard(request)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res) {
            this.stepperMoveNext();
            this.summary = {};
            this.endButtons = [
              this.backToDashboardButton,
              this.backToCardsButton,
            ];
            this.startButtons = [];
            this.result = this.fillSuccessResult();
          }
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.summary = {};
          this.startButtons = [];
          this.endButtons=[this.goApplyButton]
          this.result = this.fillErrorResult(
            error.ErrorResponse.errorDescription!
          );
        },
      });
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'cards.new-card.request-successfully',
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
}
