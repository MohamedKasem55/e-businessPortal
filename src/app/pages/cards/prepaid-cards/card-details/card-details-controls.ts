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
import {Utils} from "../../../../@core/utility/Utils";
import {AuthenticationUtils} from "../../../../@core/utility/authentication-utils";

export const buttonIDs = {
  cardViewCred: 'cards-view-credentials',
  cardCancel: 'cards-cancel-card',
  cardReplace: 'cards-replace-card',
  cardResetPin: 'cards-reset-pin',
  cardBlock: 'cards-block-card',
  cardsActivate: 'cards-activate-card',
  cardsAdvancedPayment: 'cards-advanced-payment'
};

export const getCardActionButtons = async (cardType: string) => {
  const cardActionsBtns: ButtonModel[] = [];
  if (await canViewCardCredentials(cardType)) {
    cardActionsBtns.push({
      id: buttonIDs.cardViewCred,
      text: 'cards.view-credentials',
      prefixIcon: 'arb-icon-eyeSetting fs-2',
      type: 'secondary',
    });
  }
  if (await canResetCardPIN(cardType)) {
    cardActionsBtns.push({
      id: buttonIDs.cardResetPin,
      text: 'cards.reset-pin',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardLock fs-2',
    });
  }
  if (await canCancelCard(cardType)) {
    cardActionsBtns.push({
      id: buttonIDs.cardCancel,
      text: 'cards.cancel-card',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardX fs-2',
    });

  }
  if (await canBlockCard(cardType)) {
    cardActionsBtns.push({
      id: buttonIDs.cardReplace,
      text: 'cards.cancel.cancel-replace-title',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardX fs-2',
    });
  }
  /*
  if (canPayCard(cardType)) {
    cardActionsBtns.push({
      id: buttonIDs.cardsAdvancedPayment,
      text: 'cards.payment.title',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardLock fs-2',
    });
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

export const getPrepaidCardLabels = () => {
  const cardBtns: ButtonModel[] = [];
  AuthenticationUtils.hasAccess('PayPrepaidCard') &&
  cardBtns.push(
    {
      id: 'prepaid-card-topup',
      prefixIcon: 'arb-icon-cardCheck',
      text: 'cards.topup-card',
      type: 'primary',
    },
    {
      id: 'prepaid-card-refund',
      text: 'cards.refund',
      type: 'secondary',
    }
  );
  return cardBtns;
};

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
