import { Component, OnInit } from '@angular/core';
import { CardsBaseComponent } from '../../cards-base/cards-base.component';
import { CardInfoModel } from 'arb-design-library/model/card-info.model';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { TitleModel } from 'arb-design-library/model/title.model';
import { TabModel } from 'arb-design-library/model/tab.model';
import {
  activateBtn,
  getCardActionButtons,
  cardTransactionsTitle,
  getPrepaidCardLabels,
  transactionsTabs,
  buttonIDs,
} from './card-details-controls';
import { CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import {
  getCardImage,
  isInActiveCard,
} from '../../cards-shared/cards-shared-controls';
import { CardItem } from 'arb-design-library/model/card-item.model';
import {
  PrepaidCardDetailsModel,
  PrepaidCardsDetailsResponseModel,
} from 'app/@core/model/rest/cards/prepaid-cards/details-res.model';

import {
  getCardStatus,
  isActiveCard,
} from '../../cards-shared/cards-shared-controls';

import { CardCredentialComponent } from '../../view-card-credentials/view-card-credentials.component';
import { CardDetailsFactoryService } from '../../cards-shared/card-details-factory.service';

import { lastValueFrom, take } from 'rxjs';

import {
  CARDS,
  CARDS_PREPAID_CANCEL,
  CARDS_PREPAID_CANCEL_AND_REPLACE,
  CARDS_PREPAID_PAYMENT,
  CARDS_PREPAID_REFUND,
  CARDS_PREPAID_RESET_PIN,
  CARDS_PREPAID_TOPUP,
} from 'app/@core/constants/pages-urls-constants';
import { CardCredentialOtpVerificationReqModel } from 'app/@core/model/rest/cards/card-details/card-details-credential-validate-req.model';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import moment from 'moment';
import { AlertModel } from 'app/@core/model/dto/alert.model';
import {
  CardDetailsRouteStateModel,
  CardResetPinRouteStateModel,
} from '../../cards-shared/card-details-route-state-model';
import { PrepaidCardsListModel } from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import { PrepaidCardsService } from 'app/@core/service/cards/prepaid-cards/prepaid-cards.service';
import { PrepaidCardDetailsRequestModel } from 'app/@core/model/rest/cards/prepaid-cards/details-req.model';
import { BusinessCardsListModel } from 'app/@core/model/rest/cards/business-cards/list-res.model';
import {
  CardConfirmActivationReqeust,
  CardValidateActivateRequest,
} from 'app/@core/model/rest/cards/cards-activation/cards-activation-models';
import { CardsActivationService } from 'app/@core/service/cards/cards-activation/cards-activation-service';
import { Constants } from 'app/@core/service/cards/prepaid-cards/prepaid-cards-urls';
import { CurrencyPipe } from 'app/@core/pipe/currency.pipe';
import { ActivatedRoute } from '@angular/router';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { TansxTabs } from '../../business-cards/card-details/card-details-controls';
import {
  lastTransctionsTabelHeader,
  TransactionList,
  TransactionsListTableModel,
} from 'app/@core/model/rest/cards/common/transactions-list-models';
import { AmountPipe } from 'app/@core/pipe/amount.pipe';
import { DatePipe } from '@angular/common';
import { CardStatementsRequest } from 'app/@core/model/rest/cards/common/statements-list-models';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
})
export class PrepaidCardDetailsComponent
  extends CardsBaseComponent
  implements OnInit
{
  cardActionsBtns: ButtonModel[] = [];
  activateBtn: ButtonModel[] = activateBtn;
  cardTransactionsTitle: TitleModel = cardTransactionsTitle;
  transactionsTabs: TabModel[] = transactionsTabs;
  selectedIndex!: number | undefined;
  prepaidDetails!: PrepaidCardDetailsModel;
  isActiveCard: boolean = false;
  cardInfo!: CardInfoModel;
  userCardsSize: number = 0;
  prepaidCardsList: PrepaidCardsListModel[] = [];
  alertModel!: AlertModel;
  prepaidDetailsRes!: PrepaidCardsDetailsResponseModel;
  currentTrxTab: string = this.transactionsTabs[0].value;
  tabsConst = TansxTabs;
  lastTransctionsHeaders: TableHeaderModel[] = lastTransctionsTabelHeader;
  transactionsListRes: TransactionList | undefined;
  transactionsListTableModel: TransactionsListTableModel[] = [];
  cardStatements: any;
  cardType = CARD_TYPE.PREPAID

  constructor(
    private otpService: VerificationService,
    private currencyPipe: CurrencyPipe,
    private route: ActivatedRoute,
    private cardCredentialComponent: CardCredentialComponent,
    private cardDetailsService: CardDetailsFactoryService,
    private prepaidCardsService: PrepaidCardsService,
    private amountPipe: AmountPipe,
    private datePipe: DatePipe,
    private cardsActivationService: CardsActivationService
  ) {
    super();
    this.getCardDetailsRouteState();
    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: '/cards',
      },
      { text: 'cards.card-info', url: '' },
    ]);
  }

  override ngOnInit(): void {
    this.initiateCardDetails();
  }

  getCardDetailsRouteState() {
    const state: CardDetailsRouteStateModel | undefined =
      this.router.getCurrentNavigation()?.extras.state;
    if (!state) {
      this.router.navigate(['cards']);
      return;
    }
    this.prepaidDetailsRes =
      state.cardDetails as PrepaidCardsDetailsResponseModel;
    this.selectedIndex = state.cardIndex;
    this.prepaidDetails = this.prepaidDetailsRes.prepaidCardDetails;

    this.transactionsListRes = this.prepaidDetailsRes.transactionsList;

    this.buildTransactionsModel();
  }

  buildTransactionsModel() {
    if (
      !this.transactionsListRes ||
      this.transactionsListRes.items?.length <= 0
    ) {
      this.transactionsListTableModel = [];
      return;
    }

    this.transactionsListRes.items.forEach((item) => {
      const date = this.datePipe.transform(item.date, 'MMM dd, YYYY');
      let tableModel: TransactionsListTableModel = {
        description: item.description,
        amount: this.amountPipe.transform(`${item.amount}`, undefined, ''),
        date: date ?? '',
      };
      this.transactionsListTableModel.push(tableModel);
    });
  }

  async initiateCardDetails() {
    await this.getUserPrepaidCardsFromStore();
    this.startPageDetailsLoading();
  }

  async startPageDetailsLoading() {
    await this.setCardOptionsButtons();
    this.setCurrentCardActiveStatus(this.prepaidDetails.cardStatus);
    this.formatDisplayedCardList();
  }

  async loadCurrentCardDetails(request: PrepaidCardDetailsRequestModel) {
    this.prepaidDetailsRes = await lastValueFrom(
      this.prepaidCardsService.getPrepaidCardsDetails(request).pipe(take(1))
    );

    if (!this.prepaidDetailsRes || !this.prepaidDetailsRes?.prepaidCardDetails)
      this.goBack();

    this.prepaidDetails = this.prepaidDetailsRes.prepaidCardDetails;

    this.transactionsListRes = this.prepaidDetailsRes.transactionsList;
  }

  async getUserPrepaidCardsFromStore() {
    this.prepaidCardsList =
      await this.cardDetailsService.getUserPrepaidCardsFromStore();
    this.userCardsSize = this.prepaidCardsList?.length;
  }

  async setCardOptionsButtons() {
    this.cardActionsBtns = await getCardActionButtons(CARD_TYPE.PREPAID);
  }

  formatDisplayedCardList() {
    this.cardInfo = {
      image: getCardImage(this.prepaidDetails, CARD_TYPE.PREPAID),
      balance: {
        title: this.translate.instant('cards.total-balance'),
        amount: this.getAmountWithFraction(
          this.prepaidDetails.accountsItemList[0]?.availableBalance?.toString()
        ),
        currency: this.getCurrency(),
      },
      isInActive: !isActiveCard(this.prepaidDetails.cardStatus),
      inActiveText: `cards.${getCardStatus(this.prepaidDetails.cardStatus)}`,
      items: this.getCardFields() || [],
      buttons: this.isActiveCard ? getPrepaidCardLabels() : [],
    };
  }

  getCurrency() {
    try {
      return this.currencyPipe.transform(
        this.prepaidDetails.accountsItemList[0]?.currency
      );
    } catch (error) {
      return '';
    }
  }

  getCardFields(): CardItem[] {
    let items: CardItem[] = [];
    if (this.prepaidDetails.cardNum) {
      items.push({
        title: 'cards.card-number',
        text: this.prepaidDetails.cardNum,
        isCopy: true,
      });
    }
    if (this.prepaidDetails.creationDate) {
      items.push({
        title: 'cards.creation-date-hijri',
        text: this.prepaidDetails.creationDate,
      });
    }
    if (this.prepaidDetails.expiryDate) {
      items.push({
        title: 'cards.expiry-date',
        text: this.prepaidDetails.expiryDate,
      });
    }
    items.push({
      title: 'cards.limit-amount',
      text: this.getAmountWithFraction(
        this.prepaidDetails.cardLimitAmount?.toString()
      ),
    });
    if (this.prepaidDetails.cardStatus) {
      items.push({
        title: 'cards.card-status',
        text: `cards.${getCardStatus(this.prepaidDetails.cardStatus)}`,
      });
    }

    return items;
  }

  getAmountWithFraction(amount: string | undefined) {
    if (!amount) return '0.00';

    return `${this.amountPipe.transform(
      amount,
      'A',
      ''
    )}${this.amountPipe.transform(amount, 'F', '')}`;
  }

  setCurrentCardActiveStatus(status: string) {
    this.isActiveCard = isActiveCard(status);
    this.activateBtn[0].isDisable = !isInActiveCard(status);
  }

  onBackClick(backArrowId: string): void {
    if (backArrowId === 'arrowTitle') {
      this.goBack();
    }
  }

  trxTabChanged(value: string) {
    this.currentTrxTab = value;
  }

  async onCurrentCardIndexChange(cardIndex: number): Promise<void> {
    let newCard = this.prepaidCardsList[cardIndex];
    if (!newCard) return;

    const cardDetailsRequest: PrepaidCardDetailsRequestModel = {
      cardSeqNumber: newCard.cardSeqNumber,
      rows: 20,
      page: 0,
    };
    await this.loadCurrentCardDetails(cardDetailsRequest);
    await this.startPageDetailsLoading();
  }

  onCardLabelClick(labelIndex: string) {
    switch (labelIndex) {
      case 'prepaid-card-topup':
        this.router.navigate([`${CARDS}/${CARDS_PREPAID_TOPUP}`], {
          state: this.prepaidDetails,
        });
        break;
      case 'prepaid-card-refund':
        this.router.navigate([`${CARDS}/${CARDS_PREPAID_REFUND}`], {
          state: this.prepaidDetails,
        });
        break;
    }
  }

  onCardActionBtnClick(actionBtnId: string): void {
    switch (actionBtnId) {
      case buttonIDs.cardsActivate:
        this.validateActivateCard();
        break;
      case buttonIDs.cardViewCred:
        this.startViewCardCredentialFlow();
        break;
      case buttonIDs.cardResetPin:
        this.navigateToResetPinPage();
        break;
      case buttonIDs.cardReplace:
        this.router.navigate([`../${CARDS_PREPAID_CANCEL_AND_REPLACE}`], {
          state: this.prepaidDetails,
          relativeTo: this.route,
        });
        break;
      case buttonIDs.cardCancel:
        this.router.navigate([`../${CARDS_PREPAID_CANCEL}`], {
          state: this.prepaidDetails,
          relativeTo: this.route,
        });
        break;
      case buttonIDs.cardsAdvancedPayment:
        this.router.navigate([`../${CARDS_PREPAID_PAYMENT}`], {
          state: this.prepaidDetails,
          relativeTo: this.route,
        });
        break;
    }
  }

  private startViewCardCredentialFlow() {
    let cardCredReq: CardCredentialOtpVerificationReqModel = {
      cardNumber: this.prepaidDetails.cardNum,
      cardSeqNumber: this.prepaidDetails.cardSeqNum,
      details: true,
      requestValidate: {},
    };

    this.cardCredentialComponent.buildCredentialView(
      cardCredReq,
      CARD_TYPE.PREPAID
    );
  }

  private navigateToResetPinPage() {
    let routeState: CardResetPinRouteStateModel = {
      cardDetails: this.prepaidDetails,
      cardType: CARD_TYPE.PREPAID,
    };
    this.router.navigateByUrl(`/cards/${CARDS_PREPAID_RESET_PIN}`, {
      state: routeState,
    });
  }

  validateActivateCard() {
    let validateReq: CardValidateActivateRequest = {
      cardNumber: this.prepaidDetails.cardNum,
      cardSeqNumber: this.prepaidDetails.cardSeqNum,
    };
    this.cardsActivationService
      .validateCardActivate(
        validateReq,
        Constants.PREPAID_CARD_ACTIVATION_VALIDATE
      )
      .subscribe({
        next: (validateRes) => {
          this.otpService
            .showVerification(validateRes.generateChallengeAndOTP)
            .subscribe((requestValidate: RequestValidate) => {
              this.confirmCardActivation(requestValidate);
            });
        },
      });
  }

  confirmCardActivation(requestValidate: RequestValidate) {
    let request: CardConfirmActivationReqeust = {
      cardNumber: this.prepaidDetails.cardNum,
      cardSeqNumber: this.prepaidDetails.cardSeqNum,
      requestValidate: requestValidate,
    };

    this.cardsActivationService
      .confirmCardActivate(request, Constants.PREPAID_CARD_ACTIVATION_CONFIRM)
      .subscribe({
        next: async (res) => {
          this.showSuccessAlert(this.prepaidDetails.cardNum);
          const cardDetailsRequest: PrepaidCardDetailsRequestModel = {
            cardSeqNumber: this.prepaidDetails.cardSeqNum,
            rows: 20,
            page: 0,
          };
          await this.loadCurrentCardDetails(cardDetailsRequest);
          this.startPageDetailsLoading();
        },
      });
  }

  private showSuccessAlert(cardNum: string) {
    const msg = this.translate.instant('cards.activation-success-message', {
      cardNum: cardNum,
    });
    const time = moment()
      .locale(this.translate.currentLang == 'ar' ? 'ar-SA' : 'en-SA')
      .format('HH:mm');
    const today = this.translate.instant('public.today');
    this.alert = {
      id: 'doc-alert-model',
      type: 'Success',
      title: msg,
      message: `${today} ${time}`,
      showClose: true,
    };
  }

  alertClose() {
    this.alert = null;
  }

  onTrxDownloadClick(downloadBtnId: string): void {}
}
