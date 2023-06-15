import { TableHeaderModel } from 'arb-design-library/model/table-header.model';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { TitleModel } from 'arb-design-library/model/title.model';
import { PillModel } from 'arb-design-library/model/pill.model';
import { TableHeaderType } from 'arb-design-library';
import { TabModel } from 'arb-design-library/model/tab.model';
import { CARD_TYPE } from 'app/@core/model/dto/cards-enums';
import {
  canActivateCard,
  getCardImage,
  getCardStatusBadgeType,
  isActiveCard,
  isInActiveCard,
} from '../cards-shared/cards-shared-controls';
import { BusinessCardsListModel } from 'app/@core/model/rest/cards/business-cards/list-res.model';
import { PrepaidCardsListModel } from 'app/@core/model/rest/cards/prepaid-cards/list-res.model';
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";
import { CardStatusPipe } from 'app/@core/pipe/card-status-pipe';

export interface DisplayedCardsList {
  cardIndex: number;
  cardType: string;
  cardName: string;
  image: string;
  cardNum: string;
  cardSeqNum: string;
  number: string;
  status: string;
  isActive: boolean;
  cardStatusBadge: PillModel;
  holderName: string;
  balance: string;
  limitAmount: string;
  duePayment: string;
  currency: string;
}

export const cardLandingTitle: TitleModel = {
  id: 'CardsTitle',
  type: 'Page',
  title: 'cards.cards',
};

export const getCardsLandingTitleBtns = (
  showPendingActions :boolean
): ButtonModel[] => {
  const endButtons: ButtonModel[] = [];
  if(showPendingActions) {
    endButtons.push({
      id: 'UserApprovalStatus',
      type: 'secondary',
      text: 'cards.user-approval-status',
      isDisable: !AuthenticationUtils.hasAccess('CardsRequestStatus')
    });
  }
  {
    endButtons.push({
      id: 'ApplyForNewCard',
      type: 'primary',
      text: 'cards.apply-for-new-card',
      isDisable: !AuthenticationUtils.hasAccess('applyForCards')
    });
  }
  return endButtons;
};

export const listViewBtn: ButtonModel[] = [
  {
    id: 'listViewBtn',
    prefixIcon: 'arb-icon-sideBar2',
    type: 'secondary',
    text: 'cards.list-view',
    showLoading: false,
  },
];

export const blockViewBtn: ButtonModel[] = [
  {
    id: 'blockViewBtn',
    prefixIcon: 'arb-icon-other',
    type: 'secondary',
    text: 'cards.block-view',
    showLoading: false,
  },
];

export const cardDetailsBtn = {
  id: 'card-details',
  fieldName: '',
  text: '',
  prefixIcon: 'arb-icon-other',
};

export const activateCardBtn = {
  id: 'card-status',
  text: 'status',
  fieldName: 'activationEnable',
  disableCondition: 'disableActive',
};

const cardsListTabelHeader: TableHeaderModel[] = [
  {
    title: 'cards.card-name',
    fieldName: 'cardName',
    type: TableHeaderType.LINE_CARD,
    controlOptions: {
      image: 'image',
      subTitle: 'number',
    },
  },
  {
    title: 'cards.card-holder',
    fieldName: 'holderName',
    type: TableHeaderType.TEXT,
  },
  {
    title: 'cards.balance',
    fieldName: 'balance',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currency',
    },
  },
  {
    title: 'cards.limit-amount',
    fieldName: 'limitAmount',
    type: TableHeaderType.AMOUNT_TEXT,
    controlOptions: {
      currency: 'currency',
    },
  },
  {
    title: 'cards.due-payment',
    fieldName: 'duePayment',
    type: TableHeaderType.TEXT,
  },
];

const getTableActionButtonsColumn = (): TableHeaderModel => {
  const controlOptions = [];
  canActivateCard() && controlOptions.push(activateCardBtn);
  controlOptions.push(cardDetailsBtn);
  return {
    title: 'cards.action',
    type: TableHeaderType.BUTTON,
    controlOptions: controlOptions,
  };
};

export const getCardsListTabelHeader = () => {
  if (
    cardsListTabelHeader[cardsListTabelHeader.length - 1].type !==
    TableHeaderType.BUTTON
  ) {
    cardsListTabelHeader.push(getTableActionButtonsColumn());
  }
  return cardsListTabelHeader;
};

export const creditCardsTypes = {
  '1': 'ATM',
  '2': 'VISA',
  '3': 'MASTER',
  '': '',
};

export const getCardsTabs = () => {
  //TODO: add hasAccess
  const cardsTabs: TabModel[] = [];
  cardsTabs.push({
    text: 'cards.prepaid-cards',
    value: CARD_TYPE.PREPAID,
  });

  cardsTabs.push({
    text: 'cards.credit-cards',
    value: CARD_TYPE.OWNER,
  });


  cardsTabs.push({
    text: 'cards.business-cards',
    value: CARD_TYPE.BUSINESS,
  });


  cardsTabs.push({
    text: 'cards.debit-cards',
    value: CARD_TYPE.DEBIT,
  });

  return cardsTabs;
};

const getCardName = (card: any, type: string) => {
  if (type === CARD_TYPE.OWNER) {
    return (
      card.nickname ||
      creditCardsTypes[card.cardType as keyof typeof creditCardsTypes]
    );
  }
  if (type === CARD_TYPE.DEBIT) {
    return card.nickname;
  }
  return card.cardNickName;
};

const getCardStatusText = (card: any, type: string, statusPipe: CardStatusPipe) => {

  const statusCode = card.cardStatus ? card.cardStatus : card.status
  return isInActiveCard(statusCode) ? 'cards.activate': statusPipe.transform(statusCode);
};

const getCardStatusBadge = (card: any, type: string, statusPipe: CardStatusPipe): PillModel => {
  if (
    type === CARD_TYPE.PREPAID ||
    type === CARD_TYPE.BUSINESS ||
    type === CARD_TYPE.DEBIT
  ) {
    return {
      type: getCardStatusBadgeType(card.cardStatus, type === CARD_TYPE.DEBIT),
      text: getCardStatusText(card, type, statusPipe),
    };
  }
  switch (card.status) {
    case 'S':
      return { type: 'Positive', text: getCardStatusText(card, type, statusPipe) };
    default:
      return { type: 'Activate', text: getCardStatusText(card, type, statusPipe) };
  }
};

export const getDisplayedCard = (card: any, index: number, type: string, statusPipe: CardStatusPipe) => {

  const balance = setCardBalance(card, type);
  return {
    cardIndex: index,
    cardType: type,
    cardSeqNum: card.cardSeqNumber || card.cardSeqNum,
    cardName: getCardName(card, type),
    image: getCardImage(card, type),
    cardNum: card.cardNumber,
    number: card.cardNumberDisplay || card.cardNumber || card.cardNum,
    status: getCardStatusText(card, type, statusPipe),
    isActive: card.status == 'S' || isActiveCard(card.cardStatus),
    activationEnable:
      isInActiveCard(card.cardStatus) && card != CARD_TYPE.DEBIT
        ? 'enableActive'
        : 'disableActive',
    cardStatusBadge: getCardStatusBadge(card, type, statusPipe),
    holderName: card.embossingName || '',
    balance: balance ?? '',
    limitAmount: card.crLimit || '',
    duePayment: card.dueDate || '',
    currency: card.sibaccountNumber?.currency || card.cardCurrency || '',
  };
};

const setCardBalance = (card: any, type: string) => {
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
