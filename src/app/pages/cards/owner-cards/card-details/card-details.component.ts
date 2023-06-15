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
  transactionsTabs,
} from './card-details-controls';
import {CARD_TYPE} from 'app/@core/model/dto/cards-enums';
import {getCardImage, getCardStatus, isActiveCard, isInActiveCard,} from '../../cards-shared/cards-shared-controls';
import {CardItem} from 'arb-design-library/model/card-item.model';
import {CardDetailsFactoryService} from '../../cards-shared/card-details-factory.service';
import {lastValueFrom, take} from 'rxjs';

import {CARDS_OWNER_CANCEL, CARDS_OWNER_PAYMENT,} from 'app/@core/constants/pages-urls-constants';
import moment from 'moment';
import {AlertModel} from 'app/@core/model/dto/alert.model';
import {CardDetailsRouteStateModel} from '../../cards-shared/card-details-route-state-model';

import {CardsActivationService} from 'app/@core/service/cards/cards-activation/cards-activation-service';
import {OwnerCardsListModel} from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import {OwnerCardsService} from 'app/@core/service/cards/owner-cards/owner-cards.service';
import {
  OwnerCardDetailsModel,
  OwnerCardDetailsResponseModel,
} from 'app/@core/model/rest/cards/onwer-cards/details-res.model';
import {ActivatedRoute} from '@angular/router';
import {TansxTabs} from '../../business-cards/card-details/card-details-controls';
import {TableHeaderModel} from 'arb-design-library/model/table-header.model';
import {
  lastTransctionsTabelHeader,
  TransactionsListTableModel,
} from 'app/@core/model/rest/cards/common/transactions-list-models';
import {
  OwnerCardTransactionsList,
  OwnerCardTransactionsListRes,
} from 'app/@core/model/rest/cards/onwer-cards/transactions-list-models';
import {AmountPipe} from 'app/@core/pipe/amount.pipe';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
})
export class OwnerCardDetailsComponent
  extends CardsBaseComponent
  implements OnInit
{
  cardActionsBtns: ButtonModel[] = [];
  activateBtn: ButtonModel[] = activateBtn;
  cardTransactionsTitle: TitleModel = cardTransactionsTitle;
  transactionsTabs: TabModel[] = transactionsTabs;
  selectedIndex!: number;
  cardDetails!: OwnerCardDetailsResponseModel;
  ownerDetails!: OwnerCardDetailsModel;
  isActiveCard: boolean = false;
  cardInfo!: CardInfoModel;
  userCardsSize: number = 0;
  ownerCardsList: OwnerCardsListModel[] = [];
  alertModel!: AlertModel;
  cardTypeName = '';
  currentTrxTab: string = this.transactionsTabs[0].value;
  tabsConst = TansxTabs;
  lastTransctionsHeaders!: TableHeaderModel[];
  transactionsList: OwnerCardTransactionsList[] | undefined;
  transactionsListRes: OwnerCardTransactionsListRes | undefined;
  transactionsListTableModel: TransactionsListTableModel[] = [];
  lightCardInfo: OwnerCardsListModel | undefined;

  constructor(
    private cardDetailsService: CardDetailsFactoryService,
    private ownerCardsService: OwnerCardsService,
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
      { text: 'cards.card-info', url: '0.00' },
    ]);
  }

  override ngOnInit(): void {
    this.initiateCardDetails();
  }

  async getCardDetailsRouteState() {
    const state: CardDetailsRouteStateModel | undefined =
      this.router.getCurrentNavigation()?.extras.state;
    if (!state) {
      this.router.navigate(['cards']);
      return;
    }

    this.selectedIndex = state.cardIndex || 0;
    this.ownerDetails = (
      state.cardDetails as OwnerCardDetailsResponseModel
    ).resultCardSerialList;

    this.transactionsListRes = state.transactionsListRes;

    this.transactionsList =
      this.transactionsListRes?.creditCardTransactions?.list;

    if (!this.transactionsList) return;

    this.transactionsList.forEach((item) => {
      const date = this.datePipe.transform(item.date, 'MMM dd, YYYY');
      let tableModel: TransactionsListTableModel = {
        description: item.description,
        amount: this.amountPipe.transform(`${item.amount}`, undefined, ''),
        date: date ?? '',
      };
      this.transactionsListTableModel.push(tableModel);
    });
    await this.getUserOwnerCardsFromStore();
  }

  async initiateCardDetails() {
    this.startPageDetailsLoading();
  }

  async startPageDetailsLoading() {
    await this.setCardOptionsButtons();
    this.setCurrentCardActiveStatus(this.ownerDetails.cardStatus);
    this.formatDisplayedCardList();
  }

  async loadCurrentCardDetails(request: OwnerCardsListModel): Promise<any> {
    let ownerCardRes = await lastValueFrom(
      this.ownerCardsService.getOwnerCardDetails(request).pipe(take(1))
    );

    if (!ownerCardRes || !ownerCardRes?.resultCardSerialList) this.goBack();

    this.ownerDetails = ownerCardRes.resultCardSerialList;
  }

  private getCardType(card: any) {
    //TODO: Mazrouk any
    switch (card.cardType) {
      case '1':
        return 'ATM';
      case '2':
        return 'VISA';
      case '3':
        return 'MASTER';
      default:
        return '';
    }
  }

  async getUserOwnerCardsFromStore() {
    this.ownerCardsList =
      await this.cardDetailsService.getUserOwnerCardsFromStore();
    this.userCardsSize = this.ownerCardsList?.length;

    this.lightCardInfo = this.ownerCardsList.find(
      (a) => a.cardNumber == this.ownerDetails.balance.card.cardNumber
    );

    this.cardTypeName = this.getCardType(this.lightCardInfo);
  }

  async setCardOptionsButtons() {
    this.cardActionsBtns = await getCardActionButtons(CARD_TYPE.OWNER);
  }

  formatDisplayedCardList() {
    this.cardInfo = {
      image: getCardImage(this.ownerDetails, CARD_TYPE.OWNER),
      balance: {
        title: this.translate.instant('cards.total-balance'),
        amount: this.getAmountWithFraction(this.ownerDetails.balance?.availableBalance?.toString()),
      },
      isInActive: !isActiveCard(this.ownerDetails.cardStatus),
      inActiveText: `cards.${getCardStatus(this.ownerDetails.cardStatus)}`,
      items: this.getCardFields() || [],
      buttons: [],
    };
  }

  getCardFields(): CardItem[] {
    let items: CardItem[] = [];
    if (this.ownerDetails.balance.card.cardNumber) {
      items.push({
        title: 'cards.card-number',
        text: this.ownerDetails.balance.card.cardNumber,
        isCopy: true,
      });
    }
    if (this.cardTypeName) {
      items.push({
        title: 'cards.card-type',
        text: this.cardTypeName,
      });
    }
    items.push({
      title: 'cards.date',
      text: this.ownerDetails.date ?? '',
    });
    items.push({
      title: 'cards.date-hijri',
      text: this.ownerDetails.hijraDate ?? '',
    });
    items.push({
      title: 'cards.credit-card-limit-amount',
      text: this.getAmountWithFraction(this.ownerDetails.balance?.creditLimit?.toString()),
    });
    items.push({
      title: 'cards.withdrow-limit-amount',
      text:  this.getAmountWithFraction(this.ownerDetails.balance?.availableCash?.toString()),
    });
    items.push({
      title: 'cards.amount-payable-on-due-date',
      text: this.getAmountWithFraction(this.ownerDetails.amountPayableOnDueDate?.toString()),
    });
    if (this.ownerDetails.paymentDueDate) {
      items.push({
        title: 'cards.amount-payable-due-date',
        text: this.ownerDetails.paymentDueDate,
      });
    }
    items.push({
      title: 'cards.unbilled-amount',
      text: this.getAmountWithFraction(this.ownerDetails.unbilledAmount?.toString()),
    });
    items.push({
      title: 'cards.reward-points',
      text: this.getAmountWithFraction(this.lightCardInfo?.rewardPoints?.toString()),
    });

    return items;
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

    getAmountWithFraction(amount: string | undefined) {
      if (!amount) return '0.00';

      return `${this.amountPipe.transform(
        amount,
        'A',
        ''
      )}${this.amountPipe.transform(amount, 'F', '')}`;
    }

  trxTabChanged(value: string) {
    this.currentTrxTab = value;
  }

  async onCurrentCardIndexChange(cardIndex: number): Promise<void> {
    let newCard = this.ownerCardsList[cardIndex];
    if (!newCard) return;

    await this.loadCurrentCardDetails(newCard);

    await this.startPageDetailsLoading();
  }

  onCardActionBtnClick(actionBtnId: string): void {
    switch (actionBtnId) {
      case buttonIDs.cardsActivate:
        this.confirmCardActivation();
        break;
      case buttonIDs.cardCancel:
        this.router.navigate([`../${CARDS_OWNER_CANCEL}`], {
          state: this.ownerDetails,
          relativeTo: this.route,
        });
        break;
      case buttonIDs.cardsAdvancedPayment:
        this.router.navigate([`../${CARDS_OWNER_PAYMENT}`], {
          state: this.ownerDetails,
          relativeTo: this.route,
        });
        break;
    }
  }

  confirmCardActivation() {
    const card = this.ownerCardsList[this.selectedIndex];

    this.cardsActivationService.activateOwnerCard(card).subscribe({
      next: async (res) => {
        this.showSuccessAlert(card.cardNumber);

        await this.loadCurrentCardDetails(card);
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
