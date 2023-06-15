import {CARD_TYPE} from 'app/@core/model/dto/cards-enums';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {TabModel} from 'arb-design-library/model/tab.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {
  canBlockCard,
  canCancelCard,
  canPayCard,
  canResetCardPIN,
  canViewCardCredentials,
} from '../../cards-shared/cards-shared-controls';

export const buttonIDs = {
  cardViewCred: 'cards-view-credentials',
  cardCancel: 'cards-cancel-card',
  cardResetPin: 'cards-reset-pin',
  cardBlock: 'cards-block-card',
  cardBlockAndReplace: 'cards-block-replace-card',
  cardsActivate: 'cards-activate-card',
  cardsAdvancedPayment: 'cards-advanced-payment',
};

export const getCardActionButtons = async () => {
  const cardActionsBtns: ButtonModel[] = [];
  if (await canViewCardCredentials(CARD_TYPE.BUSINESS)) {
    cardActionsBtns.push({
      id: buttonIDs.cardViewCred,
      text: 'cards.view-credentials',
      prefixIcon: 'arb-icon-eyeSetting fs-2',
      type: 'secondary',
    });
  }
  if (await canCancelCard(CARD_TYPE.BUSINESS)) {
    cardActionsBtns.push({
      id: buttonIDs.cardCancel,
      text: 'cards.cancel-card',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardX fs-2',
    });
  }
  if (await canBlockCard(CARD_TYPE.BUSINESS)) {
    cardActionsBtns.push({
      id: buttonIDs.cardBlock,
      text: 'cards.block-card',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardX fs-2',
    });
    cardActionsBtns.push({
      id: buttonIDs.cardBlockAndReplace,
      text: 'cards.block-replace-card',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardX fs-2',
    });
  }
  if (await canResetCardPIN(CARD_TYPE.BUSINESS)) {
    cardActionsBtns.push({
      id: buttonIDs.cardResetPin,
      text: 'cards.reset-pin',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardLock fs-2',
    });
  }
  if (await canPayCard(CARD_TYPE.BUSINESS)) {
    cardActionsBtns.push({
      id: buttonIDs.cardsAdvancedPayment,
      text: 'cards.payment.title',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardLock fs-2',
    });
  }
  return cardActionsBtns;
};

export const activateBtn: ButtonModel[] = [
  {
    id: buttonIDs.cardsActivate,
    text: 'cards.activate',
    type: 'primary',
  },
];


export const cardTransactionsTitle: TitleModel = {
  id: 'TransactionsTitle',
  type: 'Section',
  title: 'cards.last-transactions',
  endButtons: [],
};

export const TansxTabs = {
  transactions: '1',
  statements: '2',
};

export const transactionsTabs: TabModel[] = [
  {
    text: 'cards.transaction',
    value: TansxTabs.transactions,
  },
  {
    text: 'cards.statements',
    value: TansxTabs.statements,
  },
];

