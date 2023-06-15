import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CARDS,
  CARDS_OWNER_CANCEL,
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
import { OwnerCardDetailsModel } from 'app/@core/model/rest/cards/onwer-cards/details-res.model';
import { OwnerCardsListModel } from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import { OwnerCardPaymentReq } from 'app/@core/model/rest/cards/advanced-payment/owner-card-payment-req.model';
import { Account } from 'app/@core/model/rest/common/account';
import { AccountsService } from 'app/@core/service/accounts/accounts.service';
import { OwnerCardsService } from 'app/@core/service/cards/owner-cards/owner-cards.service';
import { FormButtonClickOutput } from 'app/shared/form/form.component';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { SummaryModel } from 'arb-design-library/model/summary.model';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import { CardDetailsFactoryService } from '../../cards-shared/card-details-factory.service';
import {
  selectedAccountControl,
  amountControl,
  typeControl,
  relatedControl,
  cycleAmountControl,
  cardTitleControl,
  paymentTitleControl,
} from './owner-cards-payment.controls';
import { AcvancedPaymentService } from 'app/@core/service/cards/advanced-payment/advanced-payment.service';
import { OwnerCardAdvancedPayment } from 'app/@core/model/rest/cards/advanced-payment/owner-card-current-cycle-amount-res';
import { AmountControl } from 'app/@core/model/dto/control/amount-control';
import { CurrencyPipe } from 'app/@core/pipe/currency.pipe';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { AccountsCommonService } from '../../../../@core/service/accounts/accounts-common.service';
import { ThemeService } from 'ng2-charts';
import { TitleControl } from 'app/@core/model/dto/control/title-control';

@Component({
  selector: 'app-credit-cards-payment',
  templateUrl: '../../cards-base/cards-base.component.html',
})
export class OwnerCardsPaymentComponent
  extends CardsBaseComponent
  implements OnInit
{
  successBackToNew!: ButtonModel;
  successBackToDash!: ButtonModel;

  card!: OwnerCardsListModel;
  creditCardsList!: OwnerCardsListModel[];
  currentCycleAmount!: OwnerCardAdvancedPayment;
  holderName: string | undefined;
  relatedAccount!: Account;

  accounts!: Account[];
  cardPaymentSummaryForm!: FormModel;
  cardPaymentForm!: FormModel;

  constructor(
    private creditCardsService: OwnerCardsService,
    private currencyPipe: CurrencyPipe,
    private acvancedPaymentService: AcvancedPaymentService,
    private cardDetailsService: CardDetailsFactoryService,
    private accountsService: AccountsCommonService
  ) {
    super();
    this.initiateCardDetails();
  }

  override ngOnInit(): void {
    this.getUserSarAccounts();
    this.getCurrentCycleAmount();
  }

  getCurrentCycleAmount() {
    this.acvancedPaymentService
      .getOwnerCardCurrentCycleAmount(this.card)
      .subscribe({
        next: (res) => {
          if (!res || !res.creditCardAdvancedPayment) this.goBack();

          this.currentCycleAmount = res.creditCardAdvancedPayment;
          this.handlePageFlow();
        },
      });
  }

  handlePageFlow() {
    if (this.pageTitle.stepper!.stepCounter <= 1) {
      this.initiatePageView();
    }
  }

  getUserSarAccounts() {
    this.accountsService.getSarAccounts().subscribe({
      next: (res) => {
        this.accounts = res.listAlertsPermissionAccount;
      },
    });
  }

  async initiateCardDetails() {
    const state: OwnerCardDetailsModel = this.router.getCurrentNavigation()
      ?.extras.state as OwnerCardDetailsModel;

    if (!state) {
      this.router.navigate(['cards']);
      return;
    }

    const storeCards =
      await this.cardDetailsService.getUserOwnerCardsFromStore();
    const currentStoreCard = storeCards.find(
      (a) => a.cardNumber == state.balance.card.cardNumber
    );

    if (!currentStoreCard) {
      this.router.navigate(['cards']);
      return;
    }

    this.card = currentStoreCard;
  }

  initiatePageView() {
    this.cardPaymentSummaryForm = new FormModel({
      id: 'cardPaymentSummaryForm',
      showDivider: true,
      controls: {
        cardTitleControl: new TitleControl(
          cardTitleControl()
        ),
        typeControl: typeControl(this.card.cardNumber.slice(this.card.cardNumber.length - 4)),
        relatedControl: new SummaryItemControl(
          relatedControl(this.card.cardAccount)
        ),
        cycleAmountControl: new SummaryItemControl(
          cycleAmountControl(`${this.currentCycleAmount.currentCycleAmount}`)
        )
      },
    });

    this.cardPaymentForm = new FormModel({
      id: 'cardPaymentForm',
      controls: {
        paymentTitleControl: new TitleControl(
          paymentTitleControl()
        ),
        selectedAccountControl: new AccountControl(selectedAccountControl),
        amountControl: new AmountControl(amountControl),
      },
    });

    this.cardPaymentForm.controls[
      'selectedAccountControl'
    ].controlOptions.options = this.accounts;

    this.pages = [new PageModel(1, this.cardPaymentSummaryForm, this.cardPaymentForm)];

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
        url: `/${CARDS}/${CARDS_OWNER_CANCEL}`,
      },
    ]);

    this.fillSummary();
  }

  override onResultChanged(formResult: FormResult[]) {
    if (this.endButtons.length > 0)
      this.endButtons[0].isDisable = !formResult[0].valid;
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
        this.payCardAmount();
        break;
      case this.backButton.id:
        this.onClickBackButton();
        break;
      case this.backToCardsButton.id:
        this.backToCards();
        break;
      case this.backToDashboardButton.id:
        this.backToDashboard();
        break;
    }
  }

  onClickBackButton() {
    switch (this.pageTitle.stepper?.stepCounter) {
      case 1:
        this.location.back()
        break;
      case 2:
        this.stepperMoveBack();
        this.fillSummary();
        this.endButtons = [this.nextButton];
        break;
    }
  }

  payCardAmount() {
    const amount = this.getControl(0, 1, 'amountControl').value;
    const selectedAccount = this.mapSelectedAccount()
    if(!selectedAccount) return
    const request: OwnerCardPaymentReq = {
      accountDTO: selectedAccount,
      amount: amount,
      cardDTO: this.card,
    };
    this.acvancedPaymentService.payOwnerCard(request).subscribe({
      next: (res) => {
        this.getCurrentCycleAmount();
        this.moveToSuccess();
      },
      error: (err) => {},
    });
  }

  mapSelectedAccount(): Account | undefined {
    const selectedAccount: Account = this.getControl(
      0,
      1,
      'selectedAccountControl'
    )?.value;

    if (!selectedAccount) return undefined;
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
  cancelCard() {
    this.creditCardsService.cancelCard(this.card).subscribe({
      next: (res) => {
        this.moveToSuccess();
      },
      error: (err) => {},
    });
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
              title: 'cards.payment.owner-card-type-name',
              image: CARDS_IMAGES.OWNER,
              subTitle: this.card.cardNumber.slice(this.card.cardNumber.length - 4),
            },
            {
              title: 'cards.payment.related-account',
              subTitle: this.card.cardAccount,
            },
          ],
        },
        {
          title: {
            id: 'cards-payment-summary-payment-title',
            title: 'cards.payment.payment-info',
          },
          items: [
            {
              title: 'cards.payment.cycle-amount',
              subTitle: `${this.currentCycleAmount.currentCycleAmount}`,
            },
          ],
        },
      ],
    };

    if (!selectedAccount) return;

    if (this.summary?.sections) {
      this.summary?.sections[1]?.items?.push(
        {
          title: 'cards.payment.total-amount',
          subTitle: `${
            this.getControl(0, 1, 'amountControl').value
          } ${this.currencyPipe.transform(selectedAccount?.currency)}`,
        },
        {
          title: 'cards.payment.account',
          subTitle: selectedAccount ? selectedAccount.fullAccountNumber : '',
        }
      );
    }
  }

  fillSuccess(summary: SummaryModel) {
    this.result = {
      type: 'Success',
      title: 'cards.payment.success-title',
      summary: summary,
    };
  }
}
