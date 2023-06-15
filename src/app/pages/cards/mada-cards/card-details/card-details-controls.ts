import {CARD_TYPE} from 'app/@core/model/dto/cards-enums';
import {ButtonModel} from 'arb-design-library/model/button.model';
import {TabModel} from 'arb-design-library/model/tab.model';
import {TitleModel} from 'arb-design-library/model/title.model';
import {TansxTabs} from '../../business-cards/card-details/card-details-controls';
import {canCancelCard, canResetCardPIN, canViewCardCredentials,} from '../../cards-shared/cards-shared-controls';
import {Utils} from "../../../../@core/utility/Utils";
import {AuthenticationUtils} from "../../../../@core/utility/authentication-utils";

export const buttonIDs = {
  cardViewCred: 'cards-view-credentials',
  cardCancel: 'cards-cancel-card',
  cardResetPin: 'cards-reset-pin',
  cardChangeConfig: 'cards-change-config',
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
    value: TansxTabs.transactions,
  },
  {
    text: 'cards.statements',
    value: TansxTabs.statements,
  },
];

export const getCardActionButtons = async () => {
  const cardActionsBtns: ButtonModel[] = [];
  let canViewCredentials = await canViewCardCredentials(CARD_TYPE.DEBIT)
  let canCancel = await canCancelCard(CARD_TYPE.DEBIT)
  let canResetPIN = await canResetCardPIN(CARD_TYPE.DEBIT)
  let canChangeConfig = AuthenticationUtils.hasAccess('DebitCardsMenu');
  if (canViewCredentials) {
    cardActionsBtns.push({
      id: buttonIDs.cardViewCred,
      text: 'cards.view-credentials',
      prefixIcon: 'arb-icon-eyeSetting fs-2',
      type: 'secondary',
    });
  }
  if (canCancel) {
    cardActionsBtns.push({
      id: buttonIDs.cardCancel,
      text: 'cards.cancel-card',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardX fs-2',
    });
  }
  if (canResetPIN) {
    cardActionsBtns.push({
      id: buttonIDs.cardResetPin,
      text: 'cards.reset-pin',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardLock fs-2',
    });
  }
  if (canChangeConfig) {
    cardActionsBtns.push({
      id: buttonIDs.cardChangeConfig,
      text: 'cards.configuration.title',
      type: 'secondary',
      prefixIcon: 'arb-icon-cardLock fs-2',
    });
  }

  return cardActionsBtns;
};
