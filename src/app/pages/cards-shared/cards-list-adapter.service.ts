import {Injectable} from '@angular/core';
import {
  CARD_TYPE,
  CARDS_IMAGES,
  CARDS_STATUS,
  CARDS_STATUS_TXT, DEBIT_CARDS_STATUS_PILL,
  DEBIT_CARDS_STATUS_TXT
} from 'app/@core/model/dto/cards-enums';
import {BusinessCardsListModel} from 'app/@core/model/rest/cards/business-cards/list-res.model';
import {DebitCardsListModel} from 'app/@core/model/rest/cards/debit-cards/list-res.model';
import {OwnerCardsListModel} from 'app/@core/model/rest/cards/onwer-cards/list-res.model';
import {PrepaidCardsListModel} from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import {PillModel} from 'arb-design-library/model/pill.model';
import {DisplayedCardsList} from './model/card-display.model';

@Injectable()
export class CardsListAdapterService {

  creditCardsTypes = {
    '1': 'ATM',
    '2': 'VISA',
    '3': 'MASTER',
    '': '',
  };

  constructor() {
  }

  getDisplayedCardsList(
    cardsList:
      | OwnerCardsListModel[]
      | PrepaidCardsListModel[]
      | BusinessCardsListModel[]
      | DebitCardsListModel[],
    cardType: string
  ): DisplayedCardsList[] {
    const list: DisplayedCardsList[] = [];
    cardsList.map((card, index) => {
      const displayedCard: DisplayedCardsList = this.getDisplayedCard(
        card,
        index,
        cardType
      );
      list.push(displayedCard);
    });

    return list;
  }

  getDisplayedCard = (card: any, index: number, type: string) => {
    const balance = this.setCardBalance(card, type);
    return {
      cardIndex: index,
      cardType: type,
      cardSeqNum: card.cardSeqNumber || card.cardSeqNum,
      cardName: this.getCardName(card, type),
      image: this.getCardImage(card, type),
      cardNum: card.cardNumber,
      number: card.cardNumberDisplay || card.cardNumber || card.cardNum,
      status: this.getCardStatusText(card, type),
      isActive: card.status == 'S' || this.isActiveCard(card.cardStatus),
      activationEnable:
        this.isInActiveCard(card.cardStatus) && card != CARD_TYPE.DEBIT
          ? 'enableActive'
          : 'disableActive',
      cardStatusBadge: this.getCardStatusBadge(card, type),
      holderName: card.embossingName || '',
      balance: balance ?? '',
      limitAmount: card.crLimit || '',
      duePayment: card.dueDate || '',
      currency: card.sibaccountNumber?.currency || card.cardCurrency || '',
    };
  };

  setCardBalance = (card: any, type: string) => {
    switch (type) {
      case CARD_TYPE.DEBIT:
        return '';
      case CARD_TYPE.OWNER:
        return '';
      case CARD_TYPE.BUSINESS:
        let businessCard = card as BusinessCardsListModel;
        return businessCard.availableCredit;
      case CARD_TYPE.PREPAID:
        let prepaidCard = card as PrepaidCardsListModel;
        return prepaidCard.availableCash;
      default:
        return '';
    }
  };

  getCardName = (card: any, type: string) => {
    if (type === CARD_TYPE.OWNER) {
      return (
        card.nickname ||
        this.creditCardsTypes[card.cardType as keyof typeof this.creditCardsTypes]
      );
    }
    if (type === CARD_TYPE.DEBIT) {
      return card.nickname;
    }
    return card.cardNickName;
  };

  getCardStatusText = (card: any, type: string) => {
    let statusText = '';
    if (type === CARD_TYPE.OWNER) {
      statusText = card.status == 'S' ? 'activated' : 'activate';
      return `cards.${statusText}`;
    }
    if (type === CARD_TYPE.PREPAID || type === CARD_TYPE.BUSINESS) {
      statusText = this.isClosedCard(card.cardStatus)
        ? 'closed'
        : this.getCardStatus(card.cardStatus);
      return `cards.${statusText}`;
    }
    if (type === CARD_TYPE.DEBIT) {
      statusText = this.getCardStatus(card.cardStatus, true);
      return `cards.${statusText}`;
    }
    return '';
  };

  getCardStatusBadge = (card: any, type: string): PillModel => {
    if (
      type === CARD_TYPE.PREPAID ||
      type === CARD_TYPE.BUSINESS ||
      type === CARD_TYPE.DEBIT
    ) {
      return {
        type: this.getCardStatusBadgeType(card.cardStatus, type === CARD_TYPE.DEBIT),
        text: this.getCardStatusText(card, type),
      };
    }
    switch (card.status) {
      case 'S':
        return {type: 'Positive', text: this.getCardStatusText(card.status, type)};
      default:
        return {type: 'Activate', text: this.getCardStatusText(card.status, type)};
    }
  };

  getCardImage = (card: any, type: string) => {
    if (card.cardIcon) return card.cardIcon;
    if (type === CARD_TYPE.OWNER) return CARDS_IMAGES.OWNER;
    if (type === CARD_TYPE.PREPAID) return CARDS_IMAGES.PREPAID;
    if (type === CARD_TYPE.DEBIT) return CARDS_IMAGES.DEBIT;
    if (type === CARD_TYPE.BUSINESS) return CARDS_IMAGES.BUSINESS;
  };

  getCardStatus = (status: string, isDebit = false) => {
    if (isDebit) {
      return DEBIT_CARDS_STATUS_TXT[
        status as keyof typeof DEBIT_CARDS_STATUS_TXT
        ];
    }
    return CARDS_STATUS_TXT[status as keyof typeof CARDS_STATUS_TXT];
  };

  isClosedCard = (statusCode: string) =>
    [
      CARDS_STATUS.CLOSED,
      CARDS_STATUS.CLOSED_BY_BANK,
      CARDS_STATUS.CLOSED_BY_CUSTOMER,
    ].includes(statusCode as CARDS_STATUS);

  isActiveCard = (status: string) =>
    status === CARDS_STATUS.ACTIVE || status === 'AT';

  isInActiveCard = (status: string) =>
    status === CARDS_STATUS.INACTIVE;

  getCardStatusBadgeType = (
    status: string,
    isDebitCard = false
  ): PillModel['type'] => {
    if (isDebitCard) {
      return DEBIT_CARDS_STATUS_PILL[
        status as keyof typeof DEBIT_CARDS_STATUS_PILL
        ] as PillModel['type'];
    }
    if (this.isClosedCard(status)) return 'Warning';
    if (status === CARDS_STATUS.ACTIVE) return 'Positive';
    return 'Activate';
  };

}
