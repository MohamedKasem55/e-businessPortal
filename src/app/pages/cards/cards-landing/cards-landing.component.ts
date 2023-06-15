import { Component, OnInit } from '@angular/core';
import { CardsBaseComponent } from './../cards-base/cards-base.component';
import { OwnerCardsService } from 'app/@core/service/cards/owner-cards/owner-cards.service';
import { PrepaidCardsService } from 'app/@core/service/cards/prepaid-cards/prepaid-cards.service';
import { take } from 'rxjs';
import { TitleModel } from 'arb-design-library/model/title.model';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { TableButtonOutputModel } from 'arb-design-library/model/table-button-output.model';
import {
  blockViewBtn,
  cardLandingTitle,
  getCardsListTabelHeader,
  listViewBtn,
  DisplayedCardsList,
  cardDetailsBtn,
  getDisplayedCard,
  getCardsTabs,
  getCardsLandingTitleBtns,
  activateCardBtn,
} from './cards-landing-controls';
import { OwnerCardsListModel } from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import { PaginationValueModel } from 'arb-design-library/model/pagination.model';
import { TabModel } from 'arb-design-library/model/tab.model';
import { CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import { PrepaidCardsListModel } from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import { BusinessCardsListModel } from 'app/@core/model/rest/cards/business-cards/list-res.model';
import { Store } from '@ngrx/store';
import {
  addOwnerCardsListAction,
  addPrepaidCardsListAction,
  addBusinessCardsListAction,
  addDebitCardsListAction,
} from '../../cards-shared/store/cards.action';
import { BusinessCardsService } from 'app/@core/service/cards/business-cards/business-cards.service';
import { DebitCardsService } from 'app/@core/service/cards/debit-cards/debit-cards.service';
import { DebitCardsListModel } from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import { CardDetailsRouteStateModel } from '../cards-shared/card-details-route-state-model';
import {
  APPLY_NEW_CARD,
  CARDS,
  CARDS_BUSINESS_DETAILS,
  CARDS_DEBIT_DETAILS,
  CARDS_OWNER_DETAILS,
  CARDS_PREPAID_DETAILS,
} from 'app/@core/constants/pages-urls-constants';
import { ActivatedRoute } from '@angular/router';
import { CardsActivationService } from 'app/@core/service/cards/cards-activation/cards-activation-service';
import {
  CardConfirmActivationReqeust,
  CardValidateActivateRequest,
} from 'app/@core/model/rest/cards/cards-activation/cards-activation-models';
import { Constants as BusinessConstants } from 'app/@core/service/cards/business-cards/business-cards-urls';
import { Constants as PrepaidConstants } from 'app/@core/service/cards/prepaid-cards/prepaid-cards-urls';
import { VerificationService } from 'app/@core/service/base/verification.service';
import { RequestValidate } from 'app/@core/model/rest/common/otp.model';
import moment from 'moment';
import { AuthenticationUtils } from '../../../@core/utility/authentication-utils';
import { Utils } from '../../../@core/utility/Utils';
import { LineCardModel } from 'arb-design-library/model/line-card.model';
import { CardStatusPipe } from 'app/@core/pipe/card-status-pipe';

@Component({
  selector: 'app-cards-landing',
  templateUrl: './cards-landing.component.html',
  styleUrls: [],
})
export class CardsLandingComponent
  extends CardsBaseComponent
  implements OnInit
{
  title: TitleModel = cardLandingTitle;
  isListView: boolean = false;
  listViewBtn: ButtonModel[] = listViewBtn;
  blockViewBtn: ButtonModel[] = blockViewBtn;
  cardsListHeader!: TableHeaderModel[];
  ownerCardsList!: DisplayedCardsList[];
  prepaidCardsList!: DisplayedCardsList[];
  businessCardsList!: DisplayedCardsList[];
  debitCardsList!: DisplayedCardsList[];
  total: number = 0;
  cardsTypes = CARD_TYPE;
  tabs: TabModel[] = [];
  currentActiveTab: string;
  ownerCards!: OwnerCardsListModel[];
  showPendingActions: boolean = AuthenticationUtils.showPendingActions;

  lineCards: LineCardModel[] | undefined = undefined;
  lineCardsSearchResult: LineCardModel[] | undefined = undefined;
  displayedCardsList: DisplayedCardsList[] = [];

  constructor(
    private store: Store,
    private creditCardsService: OwnerCardsService,
    private prepaidCardsService: PrepaidCardsService,
    private businessCardsService: BusinessCardsService,
    private debitCardsService: DebitCardsService,
    private route: ActivatedRoute,
    private cardStatusPipe: CardStatusPipe,
    private cardsActivationService: CardsActivationService,
    private otpService: VerificationService
  ) {
    super();
    this.title.endButtons = getCardsLandingTitleBtns(this.showPendingActions);
    this.tabs = getCardsTabs();
    this.cardsListHeader = getCardsListTabelHeader();
    this.currentActiveTab = this.tabs[0]?.value;
    this.setBreadcrumb([]);
    this.loadDefaultTab();
  }

  override ngOnInit(): void {}

  loadDefaultTab() {
    this.tabChanged(this.tabs[0].value);
  }

  tabChanged(value: string) {
    this.currentActiveTab = value;
    //this.isListView = this.currentActiveTab !== CARD_TYPE.DEBIT;
    this.loadCurrentTabData();
  }

  loadCurrentTabData() {
    this.lineCards = [];
    this.lineCardsSearchResult = [];
    switch (this.currentActiveTab) {
      case CARD_TYPE.PREPAID:
        AuthenticationUtils.hasAccess('PrepaidCardsMenu')
          ? this.getPrepaidCards()
          : this.resetData(CARD_TYPE.PREPAID);
        break;
      case CARD_TYPE.OWNER:
        AuthenticationUtils.hasAccess('CreditCardsMenu')
          ? this.getOwnerCards(1, 50)
          : this.resetData(CARD_TYPE.OWNER);
        break;
      case CARD_TYPE.BUSINESS:
        AuthenticationUtils.hasAccess('BusinessCardsMenu')
          ? this.getBusinessCards()
          : this.resetData(CARD_TYPE.BUSINESS);
        break;
      case CARD_TYPE.DEBIT:
        AuthenticationUtils.hasAccess('DebitCardsMenu')
          ? this.getDebitCards()
          : this.resetData(CARD_TYPE.DEBIT);
        break;
    }
  }

  setLineCards(cards: DisplayedCardsList[]) {
    this.displayedCardsList = cards;
    this.lineCards = [];
    this.lineCardsSearchResult = [];
    let tempLineCards: LineCardModel[] = [];
    cards.forEach((item, index) => {
      tempLineCards.push({
        id: item.number,
        title: item.cardName,
        card: item.image,
        subTitle: item.number,
        amountPosition: 'left',
        amount: item.balance,
        currency: item.currency,
        pill: item.cardStatusBadge,
        hasBackground: true,
      });
    });
    this.lineCards = tempLineCards;
    this.lineCardsSearchResult = tempLineCards;
  }

  getOwnerCards(page: number, rows: number) {
    this.creditCardsService
      .getOwnerCardsList(page, rows)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.cardsList?.length > 0) {
            this.ownerCards = res.cardsList;
            this.ownerCardsList = this.getDisplayedCardsList(
              res.cardsList,
              this.cardsTypes.OWNER,
              this.cardStatusPipe
            );
            this.setLineCards(this.ownerCardsList);
            this.total = res.cardsList.length; // to get total from service
            this.store.dispatch(
              addOwnerCardsListAction({ creditCards: res.cardsList })
            );
          } else {
            this.resetData(CARD_TYPE.OWNER);
          }
        },
        error: () => {
          this.resetData(CARD_TYPE.OWNER);
        },
      });
  }

  getBusinessCards() {
    this.businessCardsService
      .getBusinessCardsList()
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          if (res.businessCardsList?.items.length > 0) {
            this.businessCardsList = this.getDisplayedCardsList(
              res.businessCardsList.items,
              this.cardsTypes.BUSINESS,
              this.cardStatusPipe
            );
            this.total = res.businessCardsList.items.length; // to get total from service
            this.setLineCards(this.businessCardsList);
            this.store.dispatch(
              addBusinessCardsListAction({
                businessCards: res.businessCardsList.items,
              })
            );
          } else {
            this.resetData(CARD_TYPE.BUSINESS);
          }
        },
        error: () => {
          this.resetData(CARD_TYPE.BUSINESS);
        },
      });
  }

  getPrepaidCards() {
    this.prepaidCardsService
      .getPrepaidCardsList()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.prepaidCardsList?.length > 0) {
            this.prepaidCardsList = this.getDisplayedCardsList(
              res.prepaidCardsList,
              this.cardsTypes.PREPAID,
              this.cardStatusPipe
            );
            this.setLineCards(this.prepaidCardsList);
            this.store.dispatch(
              addPrepaidCardsListAction({ prepaidCards: res.prepaidCardsList })
            );
          } else {
            this.resetData(CARD_TYPE.PREPAID);
          }
        },
        error: () => {
          this.resetData(CARD_TYPE.PREPAID);
        },
      });
  }

  getDebitCards() {
    this.debitCardsService
      .getDebitCardsList(20, 1)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.cardDtlsLst?.length > 0) {
            this.debitCardsList = this.getDisplayedCardsList(
              res.cardDtlsLst,
              this.cardsTypes.DEBIT,
              this.cardStatusPipe
            );
            this.setLineCards(this.debitCardsList);
            this.store.dispatch(
              addDebitCardsListAction({ debitCards: res.cardDtlsLst })
            );
          } else {
            this.resetData(CARD_TYPE.DEBIT);
          }
        },
        error: () => {
          this.resetData(CARD_TYPE.DEBIT);
        },
      });
  }

  getDisplayedCardsList(
    cardsList:
      | OwnerCardsListModel[]
      | PrepaidCardsListModel[]
      | BusinessCardsListModel[]
      | DebitCardsListModel[],
    cardType: string,
    statusPipe: CardStatusPipe
  ): DisplayedCardsList[] {
    const list: DisplayedCardsList[] = [];
    cardsList.map((card, index) => {
      const displayedCard: DisplayedCardsList = getDisplayedCard(
        card,
        index,
        cardType,
        statusPipe
      );
      list.push(displayedCard);
    });

    return list;
  }

  toggleDisplayView(): void {
    this.isListView = !this.isListView;
  }

  onFilterCardsClick(e: any): void {}

  onTitleActionsClick($event: string) {
    switch ($event) {
      case 'UserApprovalStatus':
        this.router.navigate(['/cards/approval']).then(() => {});
        break;
      case 'ApplyForNewCard':
        this.router.navigate([`/${CARDS}/${APPLY_NEW_CARD}`]);
        break;
    }
  }

  onSearchCards(searchText: string): void {
    if (searchText) {
      this.lineCardsSearchResult = this.lineCards?.filter(
        (a) =>
          a.title
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()) ||
          a.subTitle
            ?.toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()) ||
          a.amount
            ?.toString()
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()) ||
          a.pill?.text
            ?.toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase())
      );
    } else {
      this.lineCardsSearchResult = this.lineCards;
    }
  }

  onCardClick(cardNum: string): void {
    let card = this.displayedCardsList.filter(
      (item) => item.cardNum == cardNum || item.number == cardNum
    )[0];

    if (!card) return;
    this.gotoCardDetails(card.cardIndex, card.cardType);
  }

  onTabelButtonClick(tableRow: TableButtonOutputModel): void {
    if (tableRow.buttonId === cardDetailsBtn.id) {
      this.gotoCardDetails(tableRow.row.cardIndex, tableRow.row.cardType);
      return;
    }
    if (tableRow.buttonId === activateCardBtn.id) {
      this.startActivation(tableRow.row);
      return;
    }
  }

  startActivation(card: DisplayedCardsList) {
    switch (card.cardType) {
      case CARD_TYPE.BUSINESS:
      case CARD_TYPE.PREPAID:
        this.activateCard(card);
        break;
      case CARD_TYPE.OWNER:
        this.activateOwnerCard(card);
        break;
    }
  }

  activateOwnerCard(card: DisplayedCardsList) {
    const currentCard = this.ownerCards.find(
      (a) => a.cardNumber == card.cardNum
    );
    if (!currentCard) return;

    this.cardsActivationService.activateOwnerCard(currentCard).subscribe({
      next: async (res) => {
        this.showSuccessAlert(currentCard.cardNumber);

        this.loadCurrentTabData();
      },
    });
  }

  activateCard(card: DisplayedCardsList) {
    let endpoint = '';
    switch (card.cardType) {
      case CARD_TYPE.BUSINESS:
        endpoint = BusinessConstants.VALIDATE_CARD_ACTIVATION;
        break;
      case CARD_TYPE.PREPAID:
        endpoint = PrepaidConstants.PREPAID_CARD_ACTIVATION_VALIDATE;
        break;
    }
    let validateReq: CardValidateActivateRequest = {
      cardNumber: card.cardNum,
      cardSeqNumber: card.cardSeqNum,
    };
    this.cardsActivationService
      .validateCardActivate(validateReq, endpoint)
      .subscribe({
        next: (validateRes) => {
          this.otpService
            .showVerification(validateRes.generateChallengeAndOTP)
            .subscribe((requestValidate: RequestValidate) => {
              this.confirmBusinessCardActivation(requestValidate, card);
            });
        },
      });
  }

  confirmBusinessCardActivation(
    requestValidate: RequestValidate,
    card: DisplayedCardsList
  ) {
    let endpoint = '';
    switch (card.cardType) {
      case CARD_TYPE.BUSINESS:
        endpoint = BusinessConstants.CONFIRM_CARD_ACTIVATION;
        break;
      case CARD_TYPE.PREPAID:
        endpoint = PrepaidConstants.PREPAID_CARD_ACTIVATION_CONFIRM;
        break;
    }

    let request: CardConfirmActivationReqeust = {
      cardNumber: card.cardNum,
      cardSeqNumber: card.cardSeqNum,
      requestValidate: {
        otp: requestValidate.otp,
      },
    };

    this.cardsActivationService
      .confirmCardActivate(request, endpoint)
      .subscribe({
        next: async (res) => {
          this.showSuccessAlert(card.cardNum);
          this.loadCurrentTabData();
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

  gotoCardDetails(cardIndex: number, cardType: string): void {
    let url = '';
    switch (cardType) {
      case this.cardsTypes.BUSINESS:
        url = CARDS_BUSINESS_DETAILS;
        break;
      case this.cardsTypes.PREPAID:
        url = CARDS_PREPAID_DETAILS;
        break;
      case this.cardsTypes.OWNER:
        url = CARDS_OWNER_DETAILS;
        break;
      case this.cardsTypes.DEBIT:
        url = CARDS_DEBIT_DETAILS;
        break;
    }
    const cardDetailsRouteData: CardDetailsRouteStateModel = {
      cardIndex,
      cardType,
    };
    this.router.navigate([`./${url}`], {
      state: cardDetailsRouteData,
      relativeTo: this.route,
    });
  }

  pagination(value: PaginationValueModel) {
    this.getOwnerCards(value.page, value.size);
  }

  private resetData(type: CARD_TYPE) {
    this.lineCards = [];
    this.lineCardsSearchResult = [];

    switch (type) {
      case CARD_TYPE.PREPAID:
        this.prepaidCardsList = [];
        break;
      case CARD_TYPE.OWNER:
        this.ownerCardsList = [];
        break;
      case CARD_TYPE.BUSINESS:
        this.businessCardsList = [];
        break;
      case CARD_TYPE.DEBIT:
        this.debitCardsList = [];
        break;
    }
  }
}
