import {ButtonModel} from 'arb-design-library/model/button.model';
import {TabModel} from 'arb-design-library/model/tab.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {canCancelCard, canPayCard,} from '../../cards-shared/cards-shared-controls';

export const buttonIDs = {
  cardViewCred: 'cards-view-credentials',
  cardCancel: 'cards-cancel-card',
  cardResetPin: 'cards-reset-pin',
  cardBlock: 'cards-block-card',
  cardsActivate: 'cards-activate-card',
  cardsAdvancedPayment: 'cards-advanced-payment',
};

export const getCardActionButtons = async (cardType: string) => {
  const cardActionsBtns: ButtonModel[] = [];
  // if (await canViewCardCredentials(cardType)) {
  //   cardActionsBtns.push({
  //     id: buttonIDs.cardViewCred,
  //     text: 'cards.view-credentials',
  //     prefixIcon: 'arb-icon-eyeSetting fs-2',
  //     type: 'secondary',
  //   });
  // }
  if (await canCancelCard(cardType)) {
    cardActionsBtns.push({
      id: buttonIDs.cardCancel,
      text: 'cards.cancel-card',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardX fs-2',
    });
  }
  // if (await canResetCardPIN(cardType)) {
  //   cardActionsBtns.push({
  //     id: buttonIDs.cardResetPin,
  //     text: 'cards.reset-pin',
  //     type: 'secondary',
  //     prefixIcon: 'arb-icon-cardLock fs-2',
  //   });
  // }
  if (await canPayCard(cardType)) {
    cardActionsBtns.push({
      id: buttonIDs.cardsAdvancedPayment,
      text: 'cards.payment.title',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardLock fs-2',
    });
  }
  /*if (canBlockCard(cardType)) {
    cardActionsBtns.push({
      id: buttonIDs.cardBlock,
      text: 'cards.reset-pin',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardLock fs-2',
    });
  }

  }*/
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

export const transactionsTabs: TabModel[] = [
  {
    text: 'cards.transaction',
    value: '1',
  },
  {
    text: 'cards.statements',
    value: '2',
  },
];
