import { CARDS_IMAGES } from 'app/@core/model/dto/cards-enums';
import { AccountControlOptions } from 'app/@core/model/dto/control/account-control';
import { AmountControlOptions } from 'app/@core/model/dto/control/amount-control';
import { DropdownControlOptions } from 'app/@core/model/dto/control/dropdown-control';
import { EmptyControlOptions } from 'app/@core/model/dto/control/empty-control';
import { LineCardControl } from 'app/@core/model/dto/control/line-card-control';
import { RadioGroupControlOptions } from 'app/@core/model/dto/control/radio-group-control';
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

export const holderNameControl = (
  itemValue: string
): SummaryItemControlOptions => {
  let item: SummaryItemControlOptions = {
    label: 'cards.payment.holder-name',
    value: itemValue,
    order: 2,
    columnCount: 4,
  };
  return item;
};

export const cardNumberControl = (
  itemValue: string
): SummaryItemControlOptions => {
  let item: SummaryItemControlOptions = {
    label: 'cards.card-number',
    value: itemValue,
    order: 3,
    columnCount: 4,
  };
  return item;
};

export const relatedControl = (
  itemValue: string
): SummaryItemControlOptions => {
  let item: SummaryItemControlOptions = {
    label: 'cards.payment.related-account',
    value: itemValue,
    order: 4,
    columnCount: 4,
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
  order: 1,
  value: null,
  columnCount: 6,
  validationLabels: {
    required: 'cards.payment.errors.select-account-required',
  },
};

export const emptyControl: EmptyControlOptions = {
  order: 2,
  columnCount: 6,
};

export const amountTypesControl: RadioGroupControlOptions = {
  label: 'cards.payment.payment-options',
  hidden: false,
  required: true,
  value: '0',
  order: 3,
  controlOptions: {
    options: [
      {
        id: '0',
        title: 'cards.due-ammount',
      },
      {
        id: '1',
        title: 'cards.outstanding-ammount',
      },
      {
        id: '2',
        title: 'cards.custom',
      },
    ],
    textOnStart: false,
  },
  columnCount: 6,
  validationLabels: {
    required: 'pos.new-request.errors.request-type-required',
  },
};

export const emptyPaymentControl: EmptyControlOptions = {
  order: 4,
  columnCount: 6,
};

export const amountControl: AmountControlOptions = {
  label: 'cards.payment.amount',
  disable: true,
  required: true,
  value: '',
  order: 5,
  columnCount: 6,
  validationLabels: {
    required: 'cards.payment.errors.amount-required',
  },
};
