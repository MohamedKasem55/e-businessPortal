import { DropdownControlOptions } from 'app/@core/model/dto/control/dropdown-control';
import { SummaryItemControlOptions } from 'app/@core/model/dto/control/sumery-item-control';
import { TitleControlOptions } from 'app/@core/model/dto/control/title-control';

export const titleControl1 = (): TitleControlOptions => {
  let item: TitleControlOptions = {
    order: 1,
    columnCount: 12,
    controlOptions: {
      id: '',
      title: 'cards.cancel.card-info',
      type: 'Section',
    },
  };
  return item;
};

export const cardTypeControl = (
  itemValue: string
): SummaryItemControlOptions => {
  let item: SummaryItemControlOptions = {
    label: 'cards.cancel.prepaid-card-type-name',
    value: itemValue,
    order: 2,
    columnCount: 6,
  };
  return item;
};

export const operationControl = (
  itemValue: string
): SummaryItemControlOptions => {
  let item: SummaryItemControlOptions = {
    label: 'cards.cancel.operation',
    value: itemValue,
    order: 3,
    columnCount: 6,
  };
  return item;
};

export const titleControl2 = (): TitleControlOptions => {
  let item: TitleControlOptions = {
    order: 1,
    columnCount: 12,
    controlOptions: {
      id: '',
      title: 'cards.cancel.reason',
      type: 'Section',
    },
  };
  return item;
};

export const reasonTypeControl: DropdownControlOptions = {
  label: 'cards.cancel.reason',
  hidden: false,
  required: true,
  order: 2,
  controlOptions: { textField: 'value', columnId: 'value' },
  columnCount: 6,
  validationLabels: {
    required: 'cards.cancel.errors.reason-required',
  },
};
