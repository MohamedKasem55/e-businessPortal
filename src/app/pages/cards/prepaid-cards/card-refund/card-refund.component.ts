import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { lastValueFrom, take } from 'rxjs';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import { topUpCardForm as refundCardForm } from './card-refund-controls';
import { PrepaidCardDetailsModel } from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';
import { PrepaidCardsListModel } from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import {
  getPrepaidCardsList,
  getSelectedCardIndex,
  getSelectedPrepaidCardDetails,
} from '../../../cards-shared/store/cards.reducer';
import { FormResult, PageModel } from 'app/@core/model/dto/formModel';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { SummarySectionModel } from 'arb-design-library/model/summary-section.model';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { PrepaidCardsService } from 'app/@core/service/cards/prepaid-cards/prepaid-cards.service';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { PrepaidLoadFundsValidateResModel } from 'app/@core/model/rest/cards/prepaid-cards/loadfunds-validate-res.model';
import { PrepaidLoadFundsValidateReqModel } from 'app/@core/model/rest/cards/prepaid-cards/loadfunds-validate-req.model';
import { ResponseException } from 'app/@core/service/base/responseException';
import { PrepaidLoadFundsConfirmReqModel } from 'app/@core/model/rest/cards/prepaid-cards/loadfunds-confirm-req.model';
import { UserProfileService } from 'app/@core/service/user-profile/user-profile.service';
import { Account } from 'app/@core/model/rest/common/account';
import { CardDetailsFactoryService } from '../../cards-shared/card-details-factory.service';
import { SEC_LVL_ST } from 'app/@core/constants/consts';
import { FutureSecurityLevelsDtolist } from 'app/@core/model/rest/common/batchResponse';
import { Utils } from 'app/@core/utility/Utils';

@Component({
  selector: 'app-card-topup',
  templateUrl: '../../cards-base/cards-base.component.html',
})
export class PrepaidCardRefundComponent
  extends CardsBaseComponent
  implements OnInit
{
  selectedCard!: PrepaidCardsListModel;
  cardDetails!: PrepaidCardDetailsModel;
  validateResponse!: PrepaidLoadFundsValidateResModel;
  accountsList: Account[] = [];
  isPending: boolean = false;

  constructor(
    private store: Store,
    private prepaidCardService: PrepaidCardsService,
    private otpService: VerificationService,
    private userProfileService: UserProfileService,
    private cardDetailsService: CardDetailsFactoryService
  ) {
    super();
    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: '/cards',
      },
      { text: 'cards.card-info', url: '/cards/details' },
      { text: 'cards.refund', url: '' },
    ]);
    this.getSelectedCard();
  }

  override ngOnInit(): void {}

  async getSelectedCard() {
    const state: PrepaidCardDetailsModel = this.router.getCurrentNavigation()
      ?.extras.state as PrepaidCardDetailsModel;

    if (!state) {
      this.router.navigate(['cards']);
      return;
    }

    this.cardDetails = state;

    const storeCards =
      await this.cardDetailsService.getUserPrepaidCardsFromStore();
    const card = storeCards.find(
      (a) => a.cardNumber == this.cardDetails.cardNum
    );

    if (!card) {
      this.router.navigate(['cards']);
      return;
    }

    this.selectedCard = card;

    this.initiatPage();
  }

  loadAccountsList() {
    this.userProfileService
      .getSARAccountList()
      .pipe(take(1))
      .subscribe((res) => {
        if (res.listAlertsPermissionAccount?.length) {
          this.accountsList = res.listAlertsPermissionAccount;
          this.assignDropdownListFieldValues(
            'paymentAccount',
            0,
            0,
            this.accountsList,
            {
              textField: 'fullAccountNumber',
              endTextField: 'availableBalance',
              endTextCurrencyField: 'currency',
            }
          );
        }
      });
  }

  initiatPage() {
    this.pageTitle.id = 'refundCardTitle';
    this.pageTitle.title = 'cards.refund';
    this.pageTitle.stepper!.steps = ['', '', ''];
    this.endButtons[0].isDisable = true;
    this.pages = [
      new PageModel(1, refundCardForm(this.cardDetails, this.selectedCard)),
    ];
    this.loadAccountsList();
  }

  override onResultChanged(data: FormResult[]): void {
    let valid = true;
    data.forEach((item) => {
      valid = valid && item.valid;
    });
    this.endButtons[0].isDisable = !valid;
  }

  override onButtonClick(formButtonClickOutPut: FormButtonClickOutput) {
    switch (formButtonClickOutPut.buttonId) {
      case 'Next':
        this.nextClick();
        break;
      case 'Back':
      case 'Edit':
        this.backClick();
        break;
      case 'Confirm':
        this.requestValidateOTP();
        break;
      case this.proceedButton.id:
        this.confirmRequest();
        break;
      case this.backToCardsButton.id:
        this.router.navigate(['/cards']);
        break;
      case this.backToDashboardButton.id:
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  backClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.goBack();
        break;
      case 2:
        this.stepperMoveBack();
        this.endButtons = [this.nextButton];
        break;
    }
  }

  nextClick() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.goToSummary();
        this.endButtons = [this.confirmButton];
    }
  }

  goToSummary() {
    this.stepperMoveNext();
    this.summary = this.fillSummary();
  }

  fillSummary(enableEditButton = true): SummaryModel {
    let sections: SummarySectionModel[] = [];
    this.pages[0].forms.forEach((item) => {
      sections.push({
        title: {
          id: 'selected-card-information',
          title: 'cards.topup.card-information',
        },
        items: [
          {
            title: 'cards.topup.card-number',
            subTitle: this.cardDetails.cardNum,
          },
          {
            title: 'cards.topup.card-holder',
            subTitle: this.selectedCard.embossingName,
          },
          {
            title: 'cards.topup.related-account',
            subTitle: this.selectedCard.cardAccount,
          },
        ],
      });
      sections.push({
        title: {
          id: 'payment-information',
          title: 'cards.topup.payment-details',
          endButtons: enableEditButton ? [this.editButton] : [],
        },
        items: [
          {
            title: 'cards.topup.account',
            subTitle: this.getControl(0, 0, 'paymentAccount').value
              .fullAccountNumber,
          },
          {
            title: 'cards.topup.amount',
            subTitle: this.getControl(0, 0, 'paymentAmount').value,
            currency: '608',
          },
        ],
      });
    });
    return {
      title: {
        id: 'SummaryTitle',
        title: 'public.summary',
      },
      sections: sections,
    };
  }

  requestValidateOTP() {
    const request: PrepaidLoadFundsValidateReqModel = {
      accountNumber: this.getControl(0, 0, 'paymentAccount').value
        .fullAccountNumber,
      amount: this.getControl(0, 0, 'paymentAmount').value,
      cardAccountNumber:
        this.cardDetails.accountsItemList[0]?.cardAccountNumber,
      cardAccountSeqNumber:
        this.cardDetails.accountsItemList[0]?.cardAccountSeqNumber,
      cardNumber: this.cardDetails.cardNum,
      cardSeqNumber: this.cardDetails.cardSeqNum,
      equivalentAmount: 0,
      feesAmount: 0,
      typeOperation: 'PR',
    };
    this.prepaidCardService
      .validateRefundFundsRequest(request)
      .pipe(take(1))
      .subscribe((res) => {
        this.handleValidateRequestResponse(res);
      });
  }

  handleValidateRequestResponse(res: PrepaidLoadFundsValidateResModel) {
    this.validateResponse = res;

    if (!this.validateResponse.batchListsContainer) {
      this.handleProcessStatus();
      return;
    }

    let futureStatus: string | undefined = '';
    if (this.validateResponse.batchListsContainer.toProcess?.length > 0)
      futureStatus =
        this.validateResponse.batchListsContainer?.toProcess[0].futureStatus;
    else if (this.validateResponse.batchListsContainer?.toAuthorize?.length )
      futureStatus =
        this.validateResponse.batchListsContainer?.toAuthorize[0].futureStatus;

    switch (futureStatus) {
      case SEC_LVL_ST.PROCESS:
        this.handleProcessStatus();
        break;
      case SEC_LVL_ST.PENDING:
        this.handlePendingStatus();
        break;
      default:
        break;
    }
  }

  handleProcessStatus() {
    if (
      this.validateResponse.generateChallengeAndOTP &&
      this.validateResponse.generateChallengeAndOTP.typeAuthentication
    )
      this.showOtp();
    else this.confirmRequest();
  }

  private handlePendingStatus() {
    this.isPending = true;
    let secList: FutureSecurityLevelsDtolist[] | undefined = [];
    if (
      this.validateResponse?.batchListsContainer &&
      this.validateResponse?.batchListsContainer?.toProcess?.length > 0
    ) {
      secList =
        this.validateResponse.batchListsContainer.toProcess[0].futureSecurityLevelsDTOList?.map(
          (e) => {
            let item: FutureSecurityLevelsDtolist = {
              auditStatus: e.auditStatus,
              batchSecurityPk: e.auditStatus,
              level: e.level,
              pdfStatus: e.pdfStatus,
              status: e.status,
              updateDate: e.updateDate,
              userPk: e.userPk,
              updater: e.updater ?? '',
            };
            return item;
          }
        );
    } else if (
      this.validateResponse?.batchListsContainer &&
      this.validateResponse?.batchListsContainer?.toAuthorize?.length
    ) {
      secList =
        this.validateResponse.batchListsContainer.toAuthorize[0].futureSecurityLevelsDTOList.map(
          (e: any) => {
            let item: FutureSecurityLevelsDtolist = {
              auditStatus: e.auditStatus,
              batchSecurityPk: e.auditStatus,
              level: e.level,
              pdfStatus: e.pdfStatus,
              status: e.status,
              updateDate: e.updateDate,
              userPk: e.userPk,
              updater: e.updater ?? '',
            };
            return item;
          }
        );
    }

    if (!secList) return;

    const summarySection = Utils.getCurrentLevelAndNextLevelSummarySection(
      this.translate,
      secList
    );
    this.summary.sections?.push(summarySection);
    this.endButtons = [this.proceedButton];
  }

  showOtp() {
    this.otpService
      .showVerification(this.validateResponse.generateChallengeAndOTP)
      .subscribe((requestValidate: RequestValidate) => {
        this.confirmRequest(requestValidate);
      });
  }

  confirmRequest(requestValidate?: RequestValidate) {
    const request: PrepaidLoadFundsConfirmReqModel = {
      prepaidCardsBatchList: this.validateResponse.batchListsContainer,
    };
    if (requestValidate) request.requestValidate = requestValidate;

    this.prepaidCardService
      .confirmPrepaidRefundRequest(request)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.stepperMoveNext();
          this.summary = {};
          this.endButtons = [
            this.backToDashboardButton,
            this.backToCardsButton,
          ];
          this.startButtons = [];
          this.result = this.fillSuccessResult();
        },
        error: (error: ResponseException) => {
          this.stepperMoveNext();
          this.summary = {};
          this.result = this.fillErrorResult(
            error.ErrorResponse.errorDescription!
          );
        },
      });
  }

  fillSuccessResult(): ResultModal {
    return {
      type: 'Success',
      title: 'cards.topup.refund-success-title',
      subTitle: 'cards.topup.refund-success-subtitle',
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
