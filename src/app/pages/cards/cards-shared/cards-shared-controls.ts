import { PillModel } from 'arb-design-library/model/pill.model';
import {
  CARDS_IMAGES,
  CARDS_STATUS_TXT,
  CARD_TYPE,
  DEBIT_CARDS_STATUS_TXT,
  DEBIT_CARDS_STATUS_PILL,
  CARDS_STATUS,
} from 'app/@core/model/dto/cards-enums';
import { CardsBaseComponent } from '../cards-base/cards-base.component';
import {Utils} from "../../../@core/utility/Utils";
import {AuthenticationUtils} from "../../../@core/utility/authentication-utils";

export const getCardImage = (card: any, type: string) => {
  if (card.cardIcon) return card.cardIcon;
  if (type === CARD_TYPE.OWNER) return CARDS_IMAGES.OWNER;
  if (type === CARD_TYPE.PREPAID) return CARDS_IMAGES.PREPAID;
  if (type === CARD_TYPE.DEBIT) return CARDS_IMAGES.DEBIT;
  if (type === CARD_TYPE.BUSINESS) return CARDS_IMAGES.BUSINESS;
};

export const getCardStatus = (status: string, isDebit = false) => {
  if (isDebit) {
    return DEBIT_CARDS_STATUS_TXT[
      status as keyof typeof DEBIT_CARDS_STATUS_TXT
    ];
  }
  return CARDS_STATUS_TXT[status as keyof typeof CARDS_STATUS_TXT];
};

export const isClosedCard = (statusCode: string) =>
  [
    CARDS_STATUS.CLOSED,
    CARDS_STATUS.CLOSED_BY_BANK,
    CARDS_STATUS.CLOSED_BY_CUSTOMER,
  ].includes(statusCode as CARDS_STATUS);

export const isActiveCard = (status: string) =>
  status === CARDS_STATUS.ACTIVE || status === 'AT';

export const isInActiveCard = (status: string) =>
  status === CARDS_STATUS.INACTIVE;

export const getCardStatusBadgeType = (
  status: string,
  isDebitCard = false
): PillModel['type'] => {
  if (isDebitCard) {
    return DEBIT_CARDS_STATUS_PILL[
      status as keyof typeof DEBIT_CARDS_STATUS_PILL
    ] as PillModel['type'];
  }
  if (isClosedCard(status)) return 'Warning';
  if (status === CARDS_STATUS.ACTIVE) return 'Positive';
  return 'Activate';
};

export const canActivateCard = () => {
  return (
    AuthenticationUtils.hasAccess('ActivatePrepaidCard') ||
    AuthenticationUtils.hasAccess('CreditCardsActivate') ||
    AuthenticationUtils.hasAccess('ActivateBusinessCards')
  );
};

export const canViewCardCredentials = async (cardType: string) => {
  if (cardType === CARD_TYPE.PREPAID) {
    return AuthenticationUtils.hasAccess('ViewCredentialsPrepaidCard') && AuthenticationUtils.isSolePropertyCompany;
  }
  if (cardType === CARD_TYPE.DEBIT) {
    return AuthenticationUtils.hasAccess('ViewCredentialsDebitCard') && AuthenticationUtils.isSolePropertyCompany;
  }
  if (cardType === CARD_TYPE.BUSINESS) {
    return AuthenticationUtils.hasAccess('ViewCredentialsBusinessCards') && AuthenticationUtils.isSolePropertyCompany;
  }
  return false;
};

export const canCancelCard = async (cardType: string) => {
  if (cardType === CARD_TYPE.OWNER) {
    return AuthenticationUtils.hasAccess('CreditCardsMenu');
  }
  if (cardType === CARD_TYPE.DEBIT) {
    return AuthenticationUtils.hasAccess('DebitCardsMenu');
  }
  if (cardType === CARD_TYPE.PREPAID) {
    return AuthenticationUtils.hasAccess('PrepaidCardsClosureRequestReplacement');
  }
  return false;
};

export const canResetCardPIN = async (cardType: string) => {
  if (cardType === CARD_TYPE.PREPAID) {
    return AuthenticationUtils.hasAccess('ManagePINPrepaidCard');
  }
  if (cardType === CARD_TYPE.BUSINESS) {
    return AuthenticationUtils.hasAccess('ManagePINBusinessCards');
  }
  if (cardType === CARD_TYPE.DEBIT) {
    return AuthenticationUtils.hasAccess('DebitCardsMenu');
  }
  return false;
};

export const canBlockCard = async (cardType: string) => {
  if (cardType === CARD_TYPE.BUSINESS) {
    return AuthenticationUtils.hasAccess('BlockBusinessCards');
  }
  if (cardType === CARD_TYPE.PREPAID) {
    return AuthenticationUtils.hasAccess('PrepaidCardsClosureRequestReplacement');
  }
  return false;
};

export const canPayCard = async (cardType: string) => {
  if (cardType === CARD_TYPE.OWNER) {
    return AuthenticationUtils.hasAccess('CreditCardsMenu');
  }
  if (cardType === CARD_TYPE.PREPAID) {
    return AuthenticationUtils.hasAccess('PayPrepaidCard');
  }
  if (cardType === CARD_TYPE.BUSINESS) {
    return AuthenticationUtils.hasAccess('PayBusinessCards');
  }
  return false;
};
