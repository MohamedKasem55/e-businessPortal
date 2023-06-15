import {
  TitleControl,
  TitleControlOptions,
} from '../../../@core/model/dto/control/title-control';
import { ValidationsEnum } from '../../../@core/model/dto/validations-enum';
import { FormModel } from '../../../@core/model/dto/formModel';
import { TableControl } from '../../../@core/model/dto/control/table-control';
import { TextInputControl } from '../../../@core/model/dto/control/text-input-control';
import { ButtonControl } from '../../../@core/model/dto/control/button-control';
import { TableHeaderType } from 'arb-design-library';
import { PillControlOptions } from '../../../@core/model/dto/control/pill-control';
import { ButtonModel } from 'arb-design-library/model/button.model';

export function selectBeneficiariesForm() {
  return new FormModel({
    id: 'selectBeneficiaries',
    controls: {
      selectedCountTitle: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: '',
          title: 'transfer.selected-beneficiaries',
          type: 'Section',
          chips: [],
          endButtons: [
            {
              id: 'AddNewBeneficiary',
              text: 'transfer.add-new-beneficiary',
              type: 'secondary',
              prefixIcon: 'arb-icon-userPlus',
            },
          ],
        },
      }),
      beneficiariesTable: new TableControl({
        columnCount: 12,
        order: 3,
        required: true,
        value: [],
        controlOptions: {
          headers: [
            {
              title: 'transfer.beneficiary.beneficiary-title',
              fieldName: 'beneficiaryFullName',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'public.nickname',
              fieldName: 'name',
              type: TableHeaderType.TEXT,
            },
            {
              title: 'public.account',
              fieldName: 'beneficiaryAccount.fullAccountNumber',
              type: TableHeaderType.TEXT,
            },
          ],
          columnId: 'beneficiaryIdErn',
          hasCheckbox: true,
          showSearch: true,
          showFilter: true,
          pageSizes: [10, 25],
          exportFileName: 'Alrajhi Beneficiaries',
          title: 'transfer.select-beneficiaries',
        },
      }),
    },
  });
}

export const pillControl: PillControlOptions = {
  columnCount: 12,
  order: 1,
  controlOptions: {
    text: '',
    type: 'Neutral',
  },
};

export const toBeneficiary: TitleControlOptions = {
  columnCount: 12,
  order: 2,
  controlOptions: {
    id: '',
    title: '',
    type: 'Section',
  },
};

export const accountDetails: TitleControlOptions = {
  columnCount: 12,
  order: 3,
  controlOptions: {
    id: '',
    title: 'transfer.account-details',
    type: 'Section',
  },
};

export const fromAccountControl = {
  label: 'public.from',
  required: true,
  order: 4,
  value: null,
  options: [],
  columnCount: 6,
  validationLabels: { required: 'transfer.account-is-required' },
};

export const amountControl = {
  label: 'public.amount',
  required: true,
  order: 4,
  value: '',
  columnCount: 6,
  validators: [{ validation: ValidationsEnum.MIN, options: '0.1' }],
  validationLabels: {
    min: 'transfer.amount-is-required',
    required: 'transfer.amount-is-required',
    max: 'you exceed the maximum transfer limit',
  },
};

export const transferDetails: TitleControlOptions = {
  columnCount: 12,
  order: 5,
  controlOptions: {
    id: '',
    title: 'transfer.transfer-details',
    type: 'Section',
  },
};

export const purposeControl = {
  label: 'transfer.purpose',
  required: false,
  order: 6,
  options: [
    { key: 1, value: 'personal' },
    { key: 2, value: 'business' },
  ],
  columnCount: 6,
  controlOptions: { textField: 'value' },
};

export const tagControl = {
  label: 'transfer.tag',
  required: false,
  order: 6,
  value: '',
  options: [
    { key: 1, value: 'personal' },
    { key: 2, value: 'business' },
  ],
  columnCount: 6,
  controlOptions: { textField: 'value' },
};

export const remarksControl = {
  label: 'transfer.remarks',
  required: false,
  order: 7,
  value: '',
  columnCount: 6,
};

export const otherTitle = {
  columnCount: 12,
  order: 8,
  controlOptions: {
    title: 'transfer.other',
    type: 'Section',
    id: '',
  },
};

export const uploadControl = {
  label: 'transfer.upload',
  required: false,
  order: 9,
  value: '',
  columnCount: 6,
};

export function getSearchForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      beneficiaryName: new TextInputControl({
        label: 'transfer.beneficiary-name',
        required: false,
        order: 1,
        columnCount: 12,
        value: '',
      }),
      cancelButton: new ButtonControl({
        order: 2,
        columnCount: 4,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'public.cancel',
        },
      }),
      resetButton: new ButtonControl({
        order: 3,
        columnCount: 4,
        controlOptions: {
          id: 'reset',
          type: 'secondary',
          text: 'public.reset',
        },
      }),
      searchButton: new ButtonControl({
        order: 4,
        columnCount: 4,
        controlOptions: {
          id: 'search',
          type: 'primary',
          text: 'public.search',
        },
      }),
    },
  });
}

export const deleteButton: ButtonModel = {
  id: 'delete',
  text: '',
  type: 'danger',
  isDisable: false,
  prefixIcon: ' arb-icon-Trash',
};

export const sameDebitCheckControl = {
  hidden: false,
  label: 'login.rememberMe',
  controlOptions: {
    id: 'rememberMe',
    title: [{ text: 'check' }],
  },
  required: false,
  order: 9,
  value: false,
  columnCount: 6,
};
