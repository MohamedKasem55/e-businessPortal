import { CARDS_IMAGES } from 'app/@core/model/dto/cards-enums';
import { DropdownControlOptions } from 'app/@core/model/dto/control/dropdown-control';
import { EmptyControlOptions } from 'app/@core/model/dto/control/empty-control';
import { LineCardControlOptions } from 'app/@core/model/dto/control/line-card-control';
import { SelectionControlOptions } from 'app/@core/model/dto/control/selection-control';
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

export const cardTypeControl = (
  itemValue: string
): LineCardControlOptions => {
  let item: LineCardControlOptions = {
    columnCount: 3,
    order: 2,
    controlOptions: {
      title: 'cards.debit-card',
      subTitle: itemValue,
      card: CARDS_IMAGES.DEBIT,
      weight: "Bold"
    }
  }
  return item;
};

export const statusControl = (itemValue: string): SummaryItemControlOptions => {
  let item: SummaryItemControlOptions = {
    label: 'cards.card-status',
    value: itemValue,
    order: 3,
    columnCount: 3,
  };
  return item;
};

export const cardManagementTitleControl = (): TitleControlOptions => {
  let item: TitleControlOptions = {
    order: 1,
    columnCount: 12,
    controlOptions: {
      id: '',
      title: 'cards.configuration.management',
      type: 'Section',
    },
  };
  return item;
};

export const enableEcommerceControl = (
  itemValue: boolean
): SelectionControlOptions => {
  let item: SelectionControlOptions = {
    hidden: false,
    required: false,
    order: 2,
    controlOptions: {
      type: 'toggle',
      value: itemValue,
      title: 'cards.configuration.enable-ecommerce',
    },
    columnCount: 12,
    validationLabels: {
      required: 'cards.configuration.errors.enable-ecommerce-required',
    },
  };
  return item;
};



export const emptyControl: EmptyControlOptions = {
  order: 3,
  columnCount: 6,
};

export const enableOnlineControl = (
  itemValue: boolean
): SelectionControlOptions => {
  let item: SelectionControlOptions = {
    hidden: false,
    required: false,
    disable: true,
    order: 4,
    controlOptions: {
      type: 'toggle',
      value: itemValue,
      title: 'cards.configuration.enable-online',
    },
    columnCount: 12,
    validationLabels: {
      required: 'cards.configuration.errors.enable-online-required',
    },
  };
  return item;
};

export const emptyControl2: EmptyControlOptions = {
  order: 5,
  columnCount: 6,
};

export const localLimitControl = (
): DropdownControlOptions => {
  let item: DropdownControlOptions = {
    label: 'cards.configuration.local-pos-limit',
    hidden: false,
    required: true,
    order: 6,
    controlOptions: { textField: ['amount', 'currency'], columnId: 'amount' },
    columnCount: 6,
    validationLabels: {
      required: 'cards.configuration.errors.local-pos-limit-required',
    },
  };
  return item;
};

export const internationalLimitControl = (
): DropdownControlOptions => {
  let item: DropdownControlOptions = {
    label: 'cards.configuration.international-pos-limit',
    hidden: false,
    required: true,
    order: 7,
    controlOptions: { textField: ['amount', 'currency'], columnId: 'amount' },
    columnCount: 6,
    validationLabels: {
      required: 'cards.configuration.errors.international-pos-limit-required',
    },
  };
  return item;
};
