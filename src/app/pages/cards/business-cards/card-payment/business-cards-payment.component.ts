import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CARDS,
  CARDS_BUSINESS_CANCEL,
} from 'app/@core/constants/pages-urls-constants';
import {
  CARDS_IMAGES,
  DEBIT_CARDS_STATUS_PILL,
} from 'app/@core/model/dto/cards-enums';
import { AccountControl } from 'app/@core/model/dto/control/account-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import {
  FormModel,
  FormResult,
  PageModel,
} from 'app/@core/model/dto/formModel';

import { ResultModal } from 'app/@core/model/dto/result.modal';
import { OwnerCardPaymentReq } from 'app/@core/model/rest/cards/advanced-payment/owner-card-payment-req.model';
import { Account } from 'app/@core/model/rest/common/account';
import { AccountsService } from 'app/@core/service/accounts/accounts.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import { CardDetailsFactoryService } from '../../cards-shared/card-details-factory.service';
import {
  selectedAccountControl,
  amountControl,
  relatedControl,
  holderNameControl,
  cardNumberControl,
  amountTypesControl,
  emptyControl,
  emptyPaymentControl,
  cardTitleControl,
  paymentTitleControl,
} from './business-cards-payment.controls';
import { AcvancedPaymentService } from 'app/@core/service/cards/advanced-payment/advanced-payment.service';

import { AmountControl } from 'app/@core/model/dto/control/amount-control';
import { CurrencyPipe } from 'app/@core/pipe/currency.pipe';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { AccountsCommonService } from '../../../../@core/service/accounts/accounts-common.service';
import { BusinessCardsService } from 'app/@core/service/cards/business-cards/business-cards.service';
import {
  BusinessCardsDetailsModel,
  BusinessCardsDetailsResponse,
} from 'app/@core/model/rest/cards/business-cards/business-cards-models';
import { BusinessCardsListModel } from 'app/@core/model/rest/cards/business-cards/list-res.model';
import { RadioGroupControl } from 'app/@core/model/dto/control/radio-group-control';
import { EmptyControl } from 'app/@core/model/dto/control/empty-control';
import { ADV_PAYMNT_CONST } from 'app/@core/service/cards/advanced-payment/advanced-payment-urls';
import {
  BusinessCardPaymentValidateDetailAndListRequest,
  BusinessCardPaymentValidateRes,
  BusinessCardSelected,
  CardPaymentConfirmRequestModel,
} from 'app/@core/model/rest/cards/advanced-payment/cards-payment-models';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { SEC_LVL_ST } from 'app/@core/constants/consts';
import { Utils } from 'app/@core/utility/Utils';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import { FutureSecurityLevelsDtolist } from 'app/@core/model/rest/common/batchResponse';
import { TitleControl, TitleControlOptions } from 'app/@core/model/dto/control/title-control';

@Component({
  selector: 'app-credit-cards-payment',
  templateUrl: '../../cards-base/cards-base.component.html',
})
export class BusinessCardsPaymentComponent
  extends CardsBaseComponent
  implements OnInit
{
  successBackToNew!: ButtonModel;
  successBackToDash!: ButtonModel;

  card!: BusinessCardsDetailsModel;
  cardListModel!: BusinessCardsListModel;
  holderName: string | undefined;
  relatedAccount!: Account;

  accounts!: Account[];
  cardPaymentForm!: FormModel;
  cardPaymentSummaryForm!: FormModel;
  selectedPaymentOption: string | undefined;
  businessCardPaymentValidateRes: BusinessCardPaymentValidateRes | undefined;
  CardPaymentConfirmRequestModel: CardPaymentConfirmRequestModel | undefined;
  isPending: boolean | undefined;

  constructor(
    private businessCardsService: BusinessCardsService,
    private currencyPipe: CurrencyPipe,
    private otpService: VerificationService,
    private acvancedPaymentService: AcvancedPaymentService,
    private cardDetailsService: CardDetailsFactoryService,
    private accountsService: AccountsCommonService
  ) {
    super();
    this.initiateCardDetails();
  }

  override ngOnInit(): void {}

  handlePageFlow() {
    if (this.pageTitle.stepper!.stepCounter <= 1) {
      this.initiatePageView();
    }
  }

  getUserSarAccounts() {
    this.accountsService.getSarAccounts().subscribe({
      next: (res) => {
        this.accounts = res.listAlertsPermissionAccount;
        this.cardPaymentForm.controls[
          'selectedAccountControl'
        ].controlOptions.options = this.accounts;
      },
    });
  }

  async initiateCardDetails() {
    const state: BusinessCardsDetailsModel = this.router.getCurrentNavigation()
      ?.extras.state as BusinessCardsDetailsModel;

    if (!state) {
      this.router.navigate(['cards']);
      return;
    }

    const storeCards =
      await this.cardDetailsService.getUserBusinessCardsFromStore();
    const currentStoreCard = storeCards.find(
      (a) => a.cardNumber == state.cardNum
    );

    if (!currentStoreCard) {
      this.router.navigate(['cards']);
      return;
    }

    this.card = state;
    this.cardListModel = currentStoreCard;

    this.handlePageFlow();
  }

  initiatePageView() {
    this.cardPaymentSummaryForm = new FormModel({
      id: 'cardPaymentSummaryForm',
      showDivider: true,
      controls: {
        cardTitleControl: new TitleControl(
          cardTitleControl()
        ),
        holderNameControl: new SummaryItemControl(
          holderNameControl(this.cardListModel.embossingName)
        ),
        cardNumberControl: new SummaryItemControl(
          cardNumberControl(this.card.cardNum)
        ),
        relatedControl: new SummaryItemControl(
          relatedControl(`${this.cardListModel.sibAccountNumber}`)
        ),
      },
    });
    this.cardPaymentForm = new FormModel({
      id: 'cardPaymentForm',
      controls: {
        paymentTitleControl: new TitleControl(
          paymentTitleControl()
        ),
        selectedAccountControl: new AccountControl(selectedAccountControl),
        emptyControl: new EmptyControl(emptyControl),
        amountTypesControl: new RadioGroupControl(amountTypesControl),
        emptyPaymentControl: new EmptyControl(emptyPaymentControl),
        amountControl: new AmountControl(amountControl),
      },
    });

    this.pages = [
      new PageModel(1, this.cardPaymentSummaryForm, this.cardPaymentForm),
    ];

    this.pageTitle = {
      id: 'CardPaymentTitle',
      title: 'cards.payment.title',
      type: 'Page',
      stepper: {
        steps: ['', '', ''],
        stepCounter: 1,
        stepText: 'public.step',
        ofText: 'public.of',
      },
    };

    this.startButtons = [this.backButton];
    this.endButtons = [this.nextButton];

    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: `/cards`,
      },
      {
        text: 'cards.payment.title',
        url: `/${CARDS}/${CARDS_BUSINESS_CANCEL}`,
      },
    ]);

    this.getUserSarAccounts();
    this.registerChangeValueEvents();
  }

  registerChangeValueEvents() {
    this.getControl(0, 1, 'amountTypesControl').valueChanges.subscribe(
      (formValueChangeModel: any) => {
        this.paymentTypeRedioButtonChangeListener(formValueChangeModel.value);
      }
    );
  }

  paymentTypeRedioButtonChangeListener(value: string) {
    this.selectedPaymentOption = value;
    if (value === ADV_PAYMNT_CONST.PAYMENT_OPTIONS.custom) {
      this.getControl(0, 1, 'amountControl').enable();
    } else {
      this.getControl(0, 1, 'amountControl').disable();
    }
  }

  override onResultChanged(formResult: FormResult[]) {
    if (this.endButtons.length > 0)
      this.endButtons[0].isDisable =
        !formResult[0].valid || !formResult[1].valid;
  }

  backToCards() {
    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: `/cards`,
      },
    ]);
    this.router.navigateByUrl(`${CARDS}`);
  }

  override onButtonClick(formButtonClickOutput: FormButtonClickOutput) {
    switch (formButtonClickOutput.buttonId) {
      case this.nextButton.id:
        this.moveToSummary();
        break;
      case this.confirmButton.id:
        this.validateCardPayment();
        break;
      case this.proceedButton.id:
        this.processPendingCardPayment();
        break;
      case this.backButton.id:
        this.handleBack();
        break;
      case this.backToCardsButton.id:
        this.backToCards();
        break;
      case this.backToDashboardButton.id:
        this.backToDashboard();
        break;
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

  private validateCardPayment() {
    let selectedAcount = this.mapSelectedAccount();

    const request: BusinessCardPaymentValidateDetailAndListRequest =
      this.buildPaymentValidateRequest(selectedAcount);
    this.acvancedPaymentService.validateBusinessCardPayment(request).subscribe({
      next: (res) => {
        this.handleValidateRequestResponse(res);
      },
      error: (err) => {},
    });
  }

  private calculatePaymentAmount(): number {
    const amount = this.getControl(0, 1, 'amountControl').value;

    if (amount && amount > 0) {
      return amount;
    } else {
      if (
        this.selectedPaymentOption ===
        ADV_PAYMNT_CONST.PAYMENT_OPTIONS.dueAmount
      ) {
        return this.payValueTransform(this.card.playableAmt);
      } else {
        return this.payValueTransform(this.card.totalAmt);
      }
    }
  }

  private payValueTransform(value: number): number {
    let changedValue: number;
    if (Math.sign(value) === -1) {
      changedValue = value * -1;
    } else {
      changedValue = value;
    }
    return changedValue;
  }

  private handleValidateRequestResponse(res: BusinessCardPaymentValidateRes) {
    this.businessCardPaymentValidateRes = res;

    this.CardPaymentConfirmRequestModel = {
      batchListsContainer: res.batchListsContainer,
    };

    let futureStatus = '';
    if (
      this.businessCardPaymentValidateRes.batchListsContainer?.toProcess
        ?.length > 0
    )
      futureStatus =
        this.businessCardPaymentValidateRes.batchListsContainer?.toProcess[0]
          ?.futureStatus;
    else if (
      this.businessCardPaymentValidateRes.batchListsContainer?.toAuthorize
        ?.length
    )
      futureStatus =
        this.businessCardPaymentValidateRes.batchListsContainer?.toAuthorize[0]
          .futureStatus;

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
      this.businessCardPaymentValidateRes?.generateChallengeAndOTP &&
      this.businessCardPaymentValidateRes?.generateChallengeAndOTP
        .typeAuthentication
    )
      this.showOtp();
    else this.confirmCardPayment();
  }

  private handlePendingStatus() {
    this.isPending = true;
    let secList: FutureSecurityLevelsDtolist[] = [];
    if (
      this.businessCardPaymentValidateRes?.batchListsContainer &&
      this.businessCardPaymentValidateRes?.batchListsContainer?.toProcess
        ?.length > 0
    ) {
      secList =
        this.businessCardPaymentValidateRes.batchListsContainer.toProcess[0].futureSecurityLevelsDTOList.map(
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
      this.businessCardPaymentValidateRes?.batchListsContainer &&
      this.businessCardPaymentValidateRes?.batchListsContainer?.toAuthorize
        ?.length
    ) {
      secList =
        this.businessCardPaymentValidateRes.batchListsContainer.toAuthorize[0].futureSecurityLevelsDTOList.map(
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
    }

    const summarySection = Utils.getCurrentLevelAndNextLevelSummarySection(
      this.translate,
      secList
    );
    this.summary.sections?.push(summarySection);
    this.endButtons = [this.proceedButton];
  }

  private processPendingCardPayment() {
    if (
      this.businessCardPaymentValidateRes?.generateChallengeAndOTP &&
      this.businessCardPaymentValidateRes?.generateChallengeAndOTP
        .typeAuthentication
    )
      this.showOtp();
    else this.confirmCardPayment();
  }

  private showOtp() {
    if (this.businessCardPaymentValidateRes) {
      this.otpService
        .showVerification(
          this.businessCardPaymentValidateRes.generateChallengeAndOTP
        )
        .subscribe((requestValidate: RequestValidate | undefined) => {
          if (this.CardPaymentConfirmRequestModel) {
            this.CardPaymentConfirmRequestModel.requestValidate =
              requestValidate;
            this.confirmCardPayment();
          }
        });
    }
  }

  private buildPaymentValidateRequest(account: Account) {
    const validateRequestModel: BusinessCardSelected = {
      accountItem: {
        authStatus: 'string',
        availableBalance: this.card.availableBal,
        availableCash: Number(this.cardListModel.availableCash),
        cardAccountNumber: this.cardListModel.cardNumber,
        cardAccountSeqNumber:
          this.card.accountsItemList[0].cardAccountSeqNumber,
        currency: 'SAR',
        limit: Number(this.cardListModel.crLimit),
      },
      accountNumber: account.fullAccountNumber,
      amount: this.calculatePaymentAmount(),
      paymentOption: Number(this.selectedPaymentOption),
    };
    const request: BusinessCardPaymentValidateDetailAndListRequest = {
      businessCardSelected: [validateRequestModel],
      cardId: this.card.cardSeqNum,
    };
    return request;
  }

  private confirmCardPayment() {
    if (!this.CardPaymentConfirmRequestModel) {
      return;
    }
    this.acvancedPaymentService
      .confirmBusinessCardPayment(this.CardPaymentConfirmRequestModel)
      .subscribe({
        next: (res) => {
          this.moveToSuccess();
        },
        error: (err) => {},
      });
  }

  private mapSelectedAccount(): Account {
    const selectedAccount: Account = this.getControl(
      0,
      1,
      'selectedAccountControl'
    ).value;
    const account = this.accounts.find(
      (a) => a.fullAccountNumber == selectedAccount.fullAccountNumber
    );
    return account!;
  }

  moveToSummary() {
    this.summary = {};
    this.fillSummary();
    this.endButtons = [];
    this.stepperMoveNext();
    this.endButtons = [this.confirmButton];
  }

  backToDashboard() {
    this.setBreadcrumb([]);
    this.router.navigateByUrl(`/dashboard`);
  }

  moveToSuccess() {
    this.endButtons = [this.backToDashboardButton, this.backToCardsButton];
    this.startButtons = [];
    this.fillSuccess(this.summary);
    this.summary = {};
    this.stepperMoveNext();
  }

  fillSummary() {
    const selectedAccount = this.mapSelectedAccount();

    this.summary = {
      sections: [
        {
          title: {
            id: 'cards-payment-summary-title',
            title: 'cards.payment.card-info',
          },
          items: [
            {
              title: 'cards.payment.business-card-type-name',
              image: CARDS_IMAGES.BUSINESS,
              subTitle: this.card.cardNum,
            },
            {
              title: 'cards.payment.holder-name',
              subTitle: this.cardListModel.embossingName,
            },
            {
              title: 'cards.payment.related-account',
              subTitle: this.cardListModel.sibAccountNumber,
            },
            {
              title: 'cards.payment.amount',
              subTitle: `${this.calculatePaymentAmount()} ${this.currencyPipe.transform(
                selectedAccount.currency
              )}`,
            },
          ],
        },
      ],
    };
  }

  fillSuccess(summary: SummaryModel) {
    let title = this.isPending
      ? 'cards.payment.pending-success-title'
      : 'cards.payment.success-title';
    this.result = {
      type: 'Success',
      title: title,
      summary: summary,
    };
  }
}
