import { CARDS_IMAGES } from 'app/@core/model/dto/cards-enums';
import { AccountControlOptions } from 'app/@core/model/dto/control/account-control';
import { AmountControlOptions } from 'app/@core/model/dto/control/amount-control';
import { LineCardControl } from 'app/@core/model/dto/control/line-card-control';
import { SummaryItemControlOptions } from 'app/@core/model/dto/control/sumery-item-control';
import { TitleControlOptions } from 'app/@core/model/dto/control/title-control';


export const cardTitleControl = (): TitleControlOptions => {
  let item: TitleControlOptions = {
    order: 1,
    columnCount: 12,
    controlOptions: {
      id: '',
      title: 'cards.payment.card-info',
      type: 'Section',
    },
  };
  return item;
};

export const typeControl = (itemValue: string) : LineCardControl => {
  let control = new LineCardControl({
    controlOptions: {
      card: CARDS_IMAGES.OWNER,
      title: 'cards.payment.owner-card-type-name',
      subTitle: itemValue,
      weight: 'Regular',
    },
    order: 2,
    columnCount: 3
  });
  return control;
};

export const relatedControl = (itemValue: string) : SummaryItemControlOptions => {
  let item : SummaryItemControlOptions= {
    label: 'cards.payment.related-account',
    value: itemValue,
    order: 3,
    columnCount: 3
  };
  return item;
};

export const cycleAmountControl = (itemValue: string) : SummaryItemControlOptions => {
  let item : SummaryItemControlOptions= {
    label: 'cards.payment.cycle-amount',
    value: itemValue,
    order: 4,
    columnCount: 3
  };
  return item;
};

export const paymentTitleControl = (): TitleControlOptions => {
  let item: TitleControlOptions = {
    order: 1,
    columnCount: 12,
    controlOptions: {
      id: '',
      title: 'cards.payment.payment-info',
      type: 'Section',
    },
  };
  return item;
};

export const selectedAccountControl: AccountControlOptions = {
  label: 'cards.payment.select-account',
  required: true,
  order: 2,
  value: null,
  columnCount: 6,
  validationLabels: {
    required: 'cards.payment.errors.select-account-required',
  },
};

export const amountControl: AmountControlOptions = {
  label: 'cards.payment.amount',
  hidden: false,
  required: true,
  value: '',
  order: 3,
  columnCount: 6,
  validationLabels: {
    required: 'cards.payment.errors.amount-required',
  },
};
