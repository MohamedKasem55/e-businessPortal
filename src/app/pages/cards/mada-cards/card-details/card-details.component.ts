import {Component, OnInit} from '@angular/core';
import {CardsBaseComponent} from '../../cards-base/cards-base.component';
import {CardInfoModel} from 'arb-design-library/model/card-info.model';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {buttonIDs, getCardActionButtons,} from './card-details-controls';
import {CurrencyPipe} from 'app/@core/pipe/currency.pipe';

import {CARD_TYPE} from 'app/@core/model/dto/cards-enums';
import {getCardImage, getCardStatus, isActiveCard,} from '../../cards-shared/cards-shared-controls';
import {CardItem} from 'arb-design-library/model/card-item.model';

import {CardCredentialComponent} from '../../view-card-credentials/view-card-credentials.component';
import {CardDetailsFactoryService} from '../../cards-shared/card-details-factory.service';
import {Store} from '@ngrx/store';
import {take} from 'rxjs';

import {
  CARDS,
  CARDS_DEBIT_CONFIG,
  CARDS_DEBIT_RESET_PIN,
  CARDS_DEBIT_SUSPEND,
} from 'app/@core/constants/pages-urls-constants';
import {CardCredentialOtpVerificationReqModel} from 'app/@core/model/rest/cards/card-details/card-details-credential-validate-req.model';
import {VerificationService} from 'app/@core/service/base/verification.service';
import {AlertModel} from 'app/@core/model/dto/alert.model';
import {
  CardBlockRouteStateModel,
  CardConfigurationRouteStateModel,
  CardDetailsRouteStateModel,
  CardResetPinRouteStateModel,
} from '../../cards-shared/card-details-route-state-model';
import {DebitCardsListModel} from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import {DebitCardsService} from 'app/@core/service/cards/debit-cards/debit-cards.service';
import {addDebitCardsListAction} from '../../../cards-shared/store/cards.action';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
})
export class DebitCardDetailsComponent
  extends CardsBaseComponent
  implements OnInit
{
  cardActionsBtns: ButtonModel[] = [];
  selectedIndex!: number;
  debitDetails!: DebitCardsListModel;
  isActiveCard: boolean = false;
  cardInfo!: CardInfoModel;
  currentTrxTab: string = '1';
  userCardsSize: number = 0;
  debitCardsList: DebitCardsListModel[] = [];
  alertModel!: AlertModel;

  constructor(
    private store: Store,
    private otpService: VerificationService,
    private currencyPipe: CurrencyPipe,
    private cardCredentialComponent: CardCredentialComponent,
    private debitCardsService: DebitCardsService,
    private cardDetailsService: CardDetailsFactoryService,
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

    this.selectedIndex = state.cardIndex ? state.cardIndex : 0;
    this.debitDetails = state.cardDetails as DebitCardsListModel;
  }

  async initiateCardDetails() {
    await this.getUserDebitCardsFromStore();
    this.startPageDetailsLoading();
  }

  async startPageDetailsLoading() {
    await this.setCardOptionsButtons();
    this.setCurrentCardActiveStatus(this.debitDetails.cardStatus);
    this.formatDisplayedCardList();
  }

  async loadCurrentCardDetails(
  ): Promise<any> {
    this.debitCardsService
      .getDebitCardsList(20, 1)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.cardDtlsLst?.length) {
            this.debitDetails = res.cardDtlsLst.find(a => a.cardNum == this.debitDetails.cardNum) ?? this.debitDetails
            this.store.dispatch(
              addDebitCardsListAction({ debitCards: res.cardDtlsLst })
            );
          }
        },
        error: () => {

        },
      });
  }

  async getUserDebitCardsFromStore() {
    this.debitCardsList =
      await this.cardDetailsService.getUserDebitCardsFromStore();
    this.userCardsSize = this.debitCardsList?.length;
  }

  async setCardOptionsButtons() {
    this.cardActionsBtns = await getCardActionButtons();
  }

  formatDisplayedCardList() {
    this.cardInfo = {
      image: getCardImage(this.debitDetails, CARD_TYPE.DEBIT),
      balance: {},
      isInActive: !isActiveCard(this.debitDetails.cardStatus),
      inActiveText: `cards.${getCardStatus(this.debitDetails.cardStatus)}`,
      items: this.getCardFields() || [],
      buttons: [],
    };
  }

  getCardFields(): CardItem[] {
    let items: CardItem[] = [];
    if (this.debitDetails.cardNum) {
      items.push({
        title: 'cards.card-number',
        text: this.debitDetails.cardNum,
        isCopy: true,
      });
    }
    if (this.debitDetails.cardStatus) {
      items.push({
        title: 'cards.card-status',
        text: `cards.${getCardStatus(this.debitDetails.cardStatus, true)}`,
      });
    }
    if (this.debitDetails.acctNum) {
      items.push({
        title: 'public.account-number',
        text: `${this.debitDetails.acctNum}`,
      });
    }
    return items;
  }

  setCurrentCardActiveStatus(status: string) {
    this.isActiveCard = isActiveCard(status);
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
    let newCard = this.debitCardsList[cardIndex];
    if (!newCard) return;

    await this.loadCurrentCardDetails();
    await this.startPageDetailsLoading();
  }

  onCardLabelClick(labelIndex: string) {
    switch (labelIndex) {
      default:
        break;
    }
  }

  onCardActionBtnClick(actionBtnId: string): void {
    switch (actionBtnId) {
      case buttonIDs.cardViewCred:
        this.startViewCardCredentialFlow();
        break;
      case buttonIDs.cardResetPin:
        this.navigateToResetPinPage();
        break;
      case buttonIDs.cardCancel:
        this.navigateToCardCancel();
        break;
      case buttonIDs.cardChangeConfig:
        this.navigateToCardChangeConfig();
        break;
    }
  }

  private navigateToCardCancel() {
    let state: CardBlockRouteStateModel = {
      cardDetails: this.debitDetails,
    };
    this.router.navigate([`${CARDS}/${CARDS_DEBIT_SUSPEND}`], {
      state: state,
    });
  }
  private navigateToCardChangeConfig() {
    let state: CardConfigurationRouteStateModel = {
      cardDetails: this.debitDetails,
    };
    this.router.navigate([`${CARDS}/${CARDS_DEBIT_CONFIG}`], {
      state: state,
    });
  }

  private startViewCardCredentialFlow() {
    let cardCredReq: CardCredentialOtpVerificationReqModel = {
      cardNumber: this.debitDetails.cardNum,
      cardSeqNumber: this.debitDetails.cardSeqNum,
      details: true,
      requestValidate: {},
    };

    this.cardCredentialComponent.buildCredentialView(
      cardCredReq,
      CARD_TYPE.DEBIT
    );
  }

  private navigateToResetPinPage() {
    let routeState: CardResetPinRouteStateModel = {
      cardDetails: this.debitDetails,
      cardType: CARD_TYPE.DEBIT,
    };

    this.router.navigateByUrl(`/cards/${CARDS_DEBIT_RESET_PIN}`, {
      state: routeState,
    });
  }

  alertClose() {
    this.alert = null;
  }

  onTrxDownloadClick(downloadBtnId: string): void {}
}
