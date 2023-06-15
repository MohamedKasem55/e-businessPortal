import { DropdownControlOptions } from 'app/@core/model/dto/control/dropdown-control';
import { SummaryItemControlOptions } from 'app/@core/model/dto/control/sumery-item-control';

export const cardTypeControl = (itemValue: string) : SummaryItemControlOptions => {
  let item : SummaryItemControlOptions= {
    label: 'cards.cancel.debit-card-type-name',
    value: itemValue,
    order: 1,
    columnCount: 3
  };
  return item;
};

export const operationControl = (itemValue: string) : SummaryItemControlOptions => {
  let item : SummaryItemControlOptions= {
    label: 'cards.cancel.operation',
    value: itemValue,
    order: 1,
    columnCount: 3
  };
  return item;
};

export const reasonTypeControl: DropdownControlOptions = {
  label: 'cards.cancel.suspend-reason',
  hidden: false,
  required: true,
  order: 2,
  controlOptions: { textField: 'displayText', columnId: 'value' },
  columnCount: 6,
  validationLabels: {
    required: 'cards.cancel.errors.suspend-reason-required',
  },
};
