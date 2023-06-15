
import { AmountControlOptions } from 'app/@core/model/dto/control/amount-control';
import { DropdownControlOptions } from 'app/@core/model/dto/control/dropdown-control';

export interface StatmentTableModel {
  postingDate?: string
  amount?: string
  merchantDescription?: string
}

export const transactionMonthsControl = (
  ): DropdownControlOptions => {
    let item: DropdownControlOptions = {
      label: 'cards.statement.month',
      hidden: false,
      required: false,
      order: 1,
      controlOptions: { textField: ['amount', 'currency'], columnId: 'amount' },
      columnCount: 6,
      validationLabels: {
        required: 'cards.statements.month-required',
      },
    };
    return item;
  };

export const amountControl: AmountControlOptions = {
  label: 'cards.payment.amount',
  hidden: false,
  required: false,
  value: '',
  order: 2,
  columnCount: 6,
  validationLabels: {
    required: 'cards.payment.errors.amount-required',
  },
};