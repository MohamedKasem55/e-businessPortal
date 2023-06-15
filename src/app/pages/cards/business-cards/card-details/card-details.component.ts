import {Component, OnInit} from '@angular/core';
import {CardsBaseComponent} from '../../cards-base/cards-base.component';
import {CardInfoModel} from 'arb-design-library/model/card-info.model';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {TabModel} from 'arb-design-library/model/tab.model';
import {
  activateBtn,
  buttonIDs,
  cardTransactionsTitle,
  getCardActionButtons,
  TansxTabs,
  transactionsTabs,
} from './card-details-controls';
import {CurrencyPipe} from 'app/@core/pipe/currency.pipe';

import {CARD_TYPE} from 'app/@core/model/dto/cards-enums';
import {getCardImage, getCardStatus, isActiveCard, isInActiveCard,} from '../../cards-shared/cards-shared-controls';
import {CardItem} from 'arb-design-library/model/card-item.model';

import {CardCredentialComponent} from '../../view-card-credentials/view-card-credentials.component';
import {CardDetailsFactoryService} from '../../cards-shared/card-details-factory.service';
import {
  BusinessCardsDetailsModel,
  BusinessCardsDetailsRequest,
  BusinessCardsDetailsResponse,
} from 'app/@core/model/rest/cards/business-cards/business-cards-models';
import {lastValueFrom, take} from 'rxjs';
import {
  CARDS,
  CARDS_BUSINESS_BLOCK,
  CARDS_BUSINESS_CANCEL,
  CARDS_BUSINESS_PAYMENT,
  CARDS_BUSINESS_RESET_PIN,
} from 'app/@core/constants/pages-urls-constants';
import {
  CardCredentialOtpVerificationReqModel
} from 'app/@core/model/rest/cards/card-details/card-details-credential-validate-req.model';
import {BusinessCardsService} from 'app/@core/service/cards/business-cards/business-cards.service';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {RequestValidate} from 'app/@core/model/rest/common/otp.model';
import moment from 'moment';
import {AlertModel} from 'app/@core/model/dto/alert.model';
import {
  CardBlockRouteStateModel,
  CardDetailsRouteStateModel,
  CardResetPinRouteStateModel,
} from '../../cards-shared/card-details-route-state-model';
import {BusinessCardsListModel} from 'app/@core/model/rest/cards/business-cards/list-res.model';
import {
  CardConfirmActivationReqeust,
  CardValidateActivateRequest,
} from 'app/@core/model/rest/cards/cards-activation/cards-activation-models';
import {ActivatedRoute} from '@angular/router';
import {CancelationOperationTypes} from 'app/@core/service/cards/cards-cancelation/cards-cancelation-reasons';
import {CardsActivationService} from 'app/@core/service/cards/cards-activation/cards-activation-service';
import {Constants} from 'app/@core/service/cards/business-cards/business-cards-urls';
import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {
  lastTransctionsTabelHeader,
  TransactionList,
  TransactionsListTableModel,
} from 'app/@core/model/rest/cards/common/transactions-list-models';
import {AmountPipe} from 'app/@core/pipe/amount.pipe';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
})
export class BusinessCardDetailsComponent
  extends CardsBaseComponent
  implements OnInit {
  cardActionsBtns: ButtonModel[] = [];
  activateBtn: ButtonModel[] = activateBtn;
  cardTransactionsTitle: TitleModel = cardTransactionsTitle;
  transactionsTabs: TabModel[] = transactionsTabs;
  selectedIndex!: number;
  cardDetails!: BusinessCardsDetailsResponse;
  businessDetails!: BusinessCardsDetailsModel;
  isActiveCard: boolean = false;
  cardInfo!: CardInfoModel;
  currentTrxTab: string = this.transactionsTabs[0].value;
  tabsConst = TansxTabs;
  userCardsSize: number = 0;
  businessCardsList: BusinessCardsListModel[] = [];
  alertModel!: AlertModel;
  lastTransctionsHeaders!: TableHeaderModel[];
  card: BusinessCardsListModel | undefined;
  transactionsList: TransactionList | undefined;
  transactionsListTableModel: TransactionsListTableModel[] = [];


  constructor(
    private otpService: VerificationService,
    private currencyPipe: CurrencyPipe,
    private cardCredentialComponent: CardCredentialComponent,
    private cardDetailsService: CardDetailsFactoryService,
    private businessCardsService: BusinessCardsService,
    private cardsActivationService: CardsActivationService,
    private amountPipe: AmountPipe,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    super();

    this.lastTransctionsHeaders = lastTransctionsTabelHeader;
    this.getCardDetailsRouteState();
    this.setBreadcrumb([
      {
        text: 'cards.cards',
        url: '/cards',
      },
      {text: 'cards.card-info', url: ''},
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

    this.selectedIndex = state.cardIndex ? state.cardIndex : 0;
    this.businessDetails = (
      state.cardDetails as BusinessCardsDetailsResponse
    ).businessCardsDetails;

    this.transactionsList = (
      state.cardDetails as BusinessCardsDetailsResponse
    ).transactionList;

    this.buildTransactionsTable();
  }

  private buildTransactionsTable() {
    if (
      !this.transactionsList ||
      !this.transactionsList.items ||
      this.transactionsList.items.length <= 0
    )
      return;

    this.transactionsList.items.forEach((item) => {
      const date = this.datePipe.transform(item.date, 'MMM dd, YYYY');
      let tableModel: TransactionsListTableModel = {
        description: item.description,
        amount: this.amountPipe.transform(
          `${item.amount}`,
          undefined,
          item.currency
        ),
        date: date ?? '',
      };
      this.transactionsListTableModel.push(tableModel);
    });
  }

  async initiateCardDetails() {
    await this.getUserBusinessCardsFromStore();
    this.startPageDetailsLoading();
  }

  async startPageDetailsLoading() {
    await this.setCardOptionsButtons();
    this.setCurrentCardActiveStatus(this.businessDetails.cardStatus);
    this.formatDisplayedCardList();
  }

  async loadCurrentCardDetails(
    request: BusinessCardsDetailsRequest
  ): Promise<any> {
    let businessCardRes = await lastValueFrom(
      this.businessCardsService.getBusinessCardDetails(request).pipe(take(1))
    );

    if (!businessCardRes || !businessCardRes?.businessCardsDetails)
      this.goBack();

    this.businessDetails = businessCardRes.businessCardsDetails;
    this.transactionsList = businessCardRes.transactionList;

    this.buildTransactionsTable();
  }

  async getUserBusinessCardsFromStore() {
    this.businessCardsList =
      await this.cardDetailsService.getUserBusinessCardsFromStore();

    this.card = this.businessCardsList.find(
      (a) => a.cardNumber == this.businessDetails.cardNum
    );

    this.userCardsSize = this.businessCardsList?.length;
  }

  async setCardOptionsButtons() {
    this.cardActionsBtns = await getCardActionButtons();
  }

  formatDisplayedCardList() {
    this.cardInfo = {
      image: getCardImage(this.businessDetails, CARD_TYPE.BUSINESS),
      balance: {
        title: this.translate.instant('cards.total-balance'),
        amount: this.businessDetails.accountsItemList[0]?.availableBalance.toString(),
        currency: this.getCurrency(),
      },
      isInActive: !isActiveCard(this.businessDetails.cardStatus),
      inActiveText: `cards.${getCardStatus(this.businessDetails.cardStatus)}`,
      items: this.getCardFields() || [],
      buttons: [],
    };
  }

  getCardFields(): CardItem[] {
    let items: CardItem[] = [];
    let currency = this.getCurrency();
    if (this.businessDetails.cardNum) {
      items.push({
        title: 'cards.card-number',
        text: this.businessDetails.cardNum,
        isCopy: true,
      });
    }
    if (this.businessDetails.dateH) {
      items.push({
        title: 'cards.pay-date-hijri',
        text: this.businessDetails.dateH,
      });
    }
    if (this.businessDetails.dateG) {
      items.push({
        title: 'cards.pay-date',
        text: this.businessDetails.dateG,
      });
    }
    items.push({
      title: 'cards.credit-card-limit-amount',
      text: this.getAmountWithFraction(this.businessDetails.accountsItemList[0]?.limit?.toString()),
    });
    items.push({
      title: 'cards.available-cash',
      text:  this.getAmountWithFraction(this.businessDetails.accountsItemList[0]?.availableCash?.toString()),
    });
    items.push({
      title: 'cards.unbilled-amount',
      text:  this.getAmountWithFraction(this.businessDetails.unbilledAmt?.toString()),
    });
    items.push({
      title: 'cards.amount-payable-on-due-date',
      text:  this.getAmountWithFraction(this.businessDetails.playableAmt?.toString()),
    });
    if (this.businessDetails.cardStatus) {
      items.push({
        title: 'cards.card-status',
        text: `cards.${getCardStatus(this.businessDetails.cardStatus)}`,
      });
    }
    if (this.businessDetails.cardSeqNum) {
      items.push({
        title: 'cards.security-code',
        text: this.businessDetails.cardSeqNum,
      });
    }
    // items.push({
    //   title: 'cards.remaining-limit',
    //   text:  this.getAmountWithFraction(this.businessDetails.accountsItemList[0]?.availableBalance?.toString()),
    // });
    return items;
  }

  getAmountWithFraction(amount: string | undefined) {
    if (!amount) return '0.00';

    return `${this.amountPipe.transform(
      amount,
      'A',
      ''
    )}${this.amountPipe.transform(amount, 'F', '')} ${this.getCurrency()}`;
  }

  getCurrency(): string {
    try {
      return this.currencyPipe.transform(
        this.businessDetails.accountsItemList[0]?.currency
      );
    } catch (error) {
      return '';
    }
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
    let newCard = this.businessCardsList[cardIndex];
    if (!newCard) return;

    const cardDetailsRequest: BusinessCardsDetailsRequest = {
      cardSeqNumber: newCard.cardSeqNumber,
      cardNumber: newCard.cardNumber,
      details: true,
      rows: 20,
      page: 0,
    };
    await this.loadCurrentCardDetails(cardDetailsRequest);

    await this.startPageDetailsLoading();
  }

  onCardLabelClick(labelIndex: string) {
    switch (labelIndex) {
      case 'prepaid-card-topup':
        this.router.navigate(['/cards/prepaid-topup']);
        break;

      default:
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
      case buttonIDs.cardCancel:
        this.router.navigate([`${CARDS}/${CARDS_BUSINESS_CANCEL}`], {
          state: this.cardDetails,
        });
        break;
      case buttonIDs.cardBlock:
        let blockstate: CardBlockRouteStateModel = {
          cardDetails: this.businessDetails,
          operationType: CancelationOperationTypes.BLOCK_OP_TYPE,
        };
        this.router.navigate([`${CARDS}/${CARDS_BUSINESS_BLOCK}`], {
          state: blockstate,
        });
        break;
      case buttonIDs.cardBlockAndReplace:
        let state: CardBlockRouteStateModel = {
          cardDetails: this.businessDetails,
          operationType: CancelationOperationTypes.BLOCK_REPL_OP_TYPE,
        };
        this.router.navigate([`${CARDS}/${CARDS_BUSINESS_BLOCK}`], {
          state: state,
        });
        break;
      case buttonIDs.cardsAdvancedPayment:
        this.router.navigate([`../${CARDS_BUSINESS_PAYMENT}`], {
          state: this.businessDetails,
          relativeTo: this.route,
        });
        break;
    }
  }

  private startViewCardCredentialFlow() {
    let cardCredReq: CardCredentialOtpVerificationReqModel = {
      cardNumber: this.businessDetails.cardNum,
      cardSeqNumber: this.businessDetails.cardSeqNum,
      details: true,
      requestValidate: {},
    };

    this.cardCredentialComponent.buildCredentialView(
      cardCredReq,
      CARD_TYPE.BUSINESS
    );
  }

  private navigateToResetPinPage() {
    let routeState: CardResetPinRouteStateModel = {
      cardDetails: this.businessDetails,
      cardType: CARD_TYPE.BUSINESS,
    };

    this.router.navigateByUrl(`/cards/${CARDS_BUSINESS_RESET_PIN}`, {
      state: routeState,
    });
  }

  validateActivateCard() {
    let validateReq: CardValidateActivateRequest = {
      cardNumber: this.businessDetails.cardNum,
      cardSeqNumber: this.businessDetails.cardSeqNum,
    };
    this.cardsActivationService
      .validateCardActivate(validateReq, Constants.VALIDATE_CARD_ACTIVATION)
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
      cardNumber: this.businessDetails.cardNum,
      cardSeqNumber: this.businessDetails.cardSeqNum,
      requestValidate: {
        otp: requestValidate.otp,
      },
    };

    this.cardsActivationService
      .confirmCardActivate(request, Constants.CONFIRM_CARD_ACTIVATION)
      .subscribe({
        next: async (res) => {
          this.showSuccessAlert(this.businessDetails.cardNum);
          const cardDetailsRequest: BusinessCardsDetailsRequest = {
            cardSeqNumber: this.businessDetails.cardSeqNum,
            cardNumber: this.businessDetails.cardNum,
            details: true,
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

  onTrxDownloadClick(downloadBtnId: string): void {
  }
}
