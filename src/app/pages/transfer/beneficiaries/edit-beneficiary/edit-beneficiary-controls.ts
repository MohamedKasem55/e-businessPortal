import { ButtonModel } from 'arb-design-library/model/button.model';
import {
  CalenderType,
  DateControl,
} from '../../../../@core/model/dto/control/date-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { FormControlModel, FormModel } from 'app/@core/model/dto/formModel';
import { ValidationsEnum } from 'app/@core/model/dto/validations-enum';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { TableControl } from 'app/@core/model/dto/control/table-control';
import { TableHeaderType } from 'arb-design-library';
import { TextControl } from 'app/@core/model/dto/control/text-control';
import { ControlBase } from '../../../../@core/model/dto/control/control.model';
import { PhoneControl } from '../../../../@core/model/dto/control/phone-control';
import { NumberInputControl } from '../../../../@core/model/dto/control/number-input-control';

export function getFinishMessage(): FormModel {
  return new FormModel({
    id: 'finishMessage',
    controls: {
      benefBankTitle: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          title: 'transfer.beneficiary.beneficiary-edited',
          type: 'Section',
          id: '',
        },
      }),
      searchButton: new ButtonControl({
        order: 2,
        columnCount: 2,
        controlOptions: {
          id: 'finish',
          type: 'primary',
          text: 'public.ok',
        },
      }),
    },
  });
}

export function beneficiaryEditWithinControls(): FormControlModel<
  ControlBase<any>
> {
  return {
    benefBankTitle: new TitleControl({
      columnCount: 12,
      order: 1,
      controlOptions: {
        title: 'public.edit',
        type: 'Section',
        id: '',
      },
    }),
    accountNumber: new TextInputControl({
      hidden: false,
      label: 'public.account-number',
      required: true,
      order: 2,
      value: '',
      validators: [
        {
          validation: ValidationsEnum.MAX_LENGTH,
          options: '24',
        },
        { validation: ValidationsEnum.ACCOUNTNUMBER },
      ],
      validationLabels: {
        required:
          'transfer.beneficiary.international.account-number-is-required',
        maxLength: 'transfer.max-length',
        translateOptions: { '0': '24' },
        pattern: 'transfer.beneficiary.account-number-format',
      },
      columnCount: 3,
      disable: true,
    }),
    nickname: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.nickname',
      required: false,
      order: 3,
      value: '',
      columnCount: 3,
      disable: true,
    }),
    beneficiaryName: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.beneficiary-name',
      required: false,
      order: 4,
      value: '',
      columnCount: 3,
      validationLabels: { required: 'transfer.name-is-required' },
      disable: true,
    }),
    email: new TextInputControl({
      hidden: false,
      label: 'public.email',
      required: true,
      validators: [{ validation: ValidationsEnum.EMAIL }],
      validationLabels: {
        required: 'transfer.email-required',
        pattern: 'transfer.email-format',
      },
      order: 5,
      value: '',
      columnCount: 3,
    }),
  };
}

export function beneficiaryEditLocalControls(): FormControlModel<
  ControlBase<any>
> {
  return {
    benefBankTitle: new TitleControl({
      columnCount: 12,
      order: 1,
      controlOptions: {
        title: 'public.edit',
        type: 'Section',
        id: '',
      },
    }),

    beneficiaryAccountNumber: new TextInputControl({
      hidden: false,
      label: 'public.iban-account-number',
      required: false,
      order: 7,
      value: '',
      validators: [
        {
          validation: ValidationsEnum.MAX_LENGTH,
          options: '24',
        },
        { validation: ValidationsEnum.ACCOUNTNUMBER },
      ],
      validationLabels: {
        required:
          'transfer.beneficiary.international.account-number-is-required',
        maxLength: 'transfer.max-length',
        translateOptions: { '0': '24' },
        pattern: 'transfer.beneficiary.account-number-format',
      },
      columnCount: 3,
      disable: true,
    }),

    bankName: new TextInputControl({
      label: 'public.bank-name',
      hidden: false,
      required: false,
      order: 9,
      columnCount: 3,
      validationLabels: { required: 'transfer.bank-is-required' },
      value: '',
      disable: true,
    }),

    beneficiaryName: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.beneficiary-name',
      required: false,
      order: 11,
      value: '',
      columnCount: 3,
      validationLabels: { required: 'transfer.name-is-required' },
      disable: true,
    }),
    email: new TextInputControl({
      hidden: false,
      label: 'public.email',
      required: true,
      validators: [{ validation: ValidationsEnum.EMAIL }],
      validationLabels: {
        required: 'transfer.email-required',
        pattern: 'transfer.email-format',
      },
      order: 13,
      value: '',
      columnCount: 3,
    }),
  };
}

export function beneficiaryEditInternationalControls(): FormControlModel<
  ControlBase<any>
> {
  return {
    benefBankTitle: new TitleControl({
      columnCount: 12,
      order: 1,
      controlOptions: {
        title: '',
        type: 'Section',
        id: '',
      },
    }),
    category: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.category',
      required: false,
      order: 2,
      value: '',
      columnCount: 12,
      disable: true,
    }),
    benefBankDetails: new TitleControl({
      columnCount: 12,
      order: 3,
      controlOptions: {
        title: 'transfer.beneficiary.international.beneficiary-bank-details',
        type: 'Section',
        id: '',
      },
      disable: true,
    }),

    country: new TextInputControl({
      label: 'public.country',
      hidden: false,
      required: false,
      order: 4,
      columnCount: 4,
      validationLabels: { required: 'transfer.country-is-required' },
      disable: true,
    }),

    bankName: new TextInputControl({
      label: 'transfer.beneficiary.international.bank-name',
      hidden: false,
      required: false,
      order: 5,
      columnCount: 4,
      validationLabels: { required: 'transfer.bank-is-required' },
      disable: true,
    }),
    currency: new TextInputControl({
      label: 'public.currency',
      hidden: false,
      required: false,
      order: 6,
      columnCount: 4,
      validationLabels: { required: 'transfer.currency-is-required' },
      disable: true,
    }),

    benefDetails: new TitleControl({
      columnCount: 12,
      order: 7,
      controlOptions: {
        title: 'transfer.beneficiary.international.beneficiary-details',
        type: 'Section',
        id: '',
      },
    }),

    benefCategory: new DropdownControl({
      hidden: false,
      label: 'transfer.beneficiary.international.change-category',
      required: false,
      order: 8,
      controlOptions: {
        columnId: 'key',
        hasSearch: true,
        textField: 'value',
        options: [
          { key: 'I', value: 'transfer.beneficiary.international.INDIVIDUAL' },
          { key: 'C', value: 'transfer.beneficiary.international.COMPANY' },
        ],
      },
      value: '',
      columnCount: 12,
    }),

    beneficiaryAccountNumber: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.beneficiary-account',
      required: false,
      order: 9,
      value: '',
      validators: [
        {
          validation: ValidationsEnum.MAX_LENGTH,
          options: '24',
        },
        { validation: ValidationsEnum.ACCOUNTNUMBER },
      ],
      validationLabels: {
        required:
          'transfer.beneficiary.international.account-number-is-required',
        maxLength: 'transfer.max-length',
        translateOptions: { '0': '24' },
        pattern: 'transfer.beneficiary.account-number-format',
      },
      columnCount: 3,
      disable: true,
    }),

    beneficiaryAccountNumberRetype: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.retype-beneficiary-account',
      required: false,
      order: 10,
      value: '',
      validators: [
        {
          validation: ValidationsEnum.MAX_LENGTH,
          options: '24',
        },
        { validation: ValidationsEnum.ACCOUNTNUMBER },
      ],
      validationLabels: {
        required:
          'transfer.beneficiary.international.account-number-is-required',
        maxLength: 'transfer.max-length',
        translateOptions: { '0': '24' },
        pattern: 'transfer.beneficiary.account-number-format',
      },
      columnCount: 3,
      disable: true,
    }),

    shortCode: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.short-code',
      required: false,
      order: 11,
      value: '',
      columnCount: 3,
      validationLabels: { required: 'transfer.name-is-required' },
      disable: true,
    }),

    beneficiaryName: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.beneficiary-name',
      required: false,
      order: 12,
      value: '',
      columnCount: 3,
      validationLabels: { required: 'transfer.name-is-required' },
      disable: true,
    }),
    customerName: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.customer-name',
      required: false,
      order: 13,
      value: '',
      columnCount: 3,
      validationLabels: { required: 'transfer.name-is-required' },
      disable: true,
    }),
    beneficiaryfullName: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.beneficiary-fullName',
      required: false,
      order: 14,
      value: '',
      columnCount: 3,
      validationLabels: { required: 'transfer.name-is-required' },
      disable: true,
    }),

    dateOfBirth: new DateControl({
      label: 'transfer.beneficiary.international.date-of-birth',
      hidden: false,
      required: true,
      order: 15,
      columnCount: 3,
      validationLabels: {
        required:
          'transfer.beneficiary.international.date-of-birth-is-required',
      },
      controlOptions: {
        type: CalenderType.GREGORIAN,
      },
    }),
    placeOfBirth: new DropdownControl({
      label: 'transfer.beneficiary.international.place-of-birth',
      hidden: false,
      required: true,
      order: 16,
      controlOptions: { columnId: 'key', textField: 'value', hasSearch: true },
      columnCount: 3,
      validationLabels: {
        required: 'transfer.beneficiary.international.nationality-is-required',
      },
    }),

    beneficiaryType: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.beneficiary-type',
      required: false,
      order: 17,
      value: '',
      columnCount: 3,
      disable: true,
    }),

    beneficiaryNationality: new DropdownControl({
      label: 'transfer.beneficiary.international.beneficiary-nationality',
      hidden: false,
      required: false,
      order: 18,
      controlOptions: { columnId: 'key', textField: 'value', hasSearch: true },
      columnCount: 3,
      validationLabels: {
        required: 'transfer.beneficiary.international.nationality-is-required',
      },
    }),

    mobile: new PhoneControl({
      hidden: false,
      label: 'transfer.beneficiary.international.beneficiary-mobile-no',
      required: true,
      order: 19,
      value: '',
      validators: [{ validation: ValidationsEnum.MOBILE_INT_BEN }],
      validationLabels: {
        required: 'transfer.mobile-is-required',
        pattern: 'transfer.int-mobile-format',
      },
      columnCount: 3,
    }),

    email: new TextInputControl({
      hidden: false,
      label: 'public.email',
      required: true,
      validators: [{ validation: ValidationsEnum.EMAIL }],
      validationLabels: {
        required: 'transfer.email-required',
        pattern: 'transfer.email-format',
      },
      order: 20,
      value: '',
      columnCount: 3,
    }),

    benefAddress: new TitleControl({
      hidden: false,
      columnCount: 12,
      order: 21,
      controlOptions: {
        title: 'transfer.beneficiary.international.beneficiary-address',
        type: 'Section',
        id: '',
      },
    }),

    benefAddress1: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.beneficiary-address-1',
      required: true,
      validators: [],
      validationLabels: {
        required:
          'transfer.beneficiary.international.beneficiary-address-1-is-required',
      },
      order: 22,
      value: '',
      columnCount: 3,
    }),
    street: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.street-building-number',
      required: true,
      validators: [],
      validationLabels: {
        required:
          'transfer.beneficiary.international.street-building-number-is-required',
      },
      order: 23,
      value: '',
      columnCount: 3,
    }),
    benefAddress2: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.beneficiary-address-2',
      required: true,
      validators: [],
      validationLabels: {
        required:
          'transfer.beneficiary.international.beneficiary-address-2-is-required',
      },
      order: 24,
      value: '',
      columnCount: 3,
    }),
    postalCode: new NumberInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.postal-code',
      required: true,
      validators: [{ validation: ValidationsEnum.DIGIT_ONLY }],
      validationLabels: {
        required: 'transfer.beneficiary.international.postal-code-is-required',
        pattern: 'transfer.postal-code-format',
      },
      order: 25,
      value: '',
      columnCount: 3,
    }),

    countryAddress: new DropdownControl({
      label: 'public.country',
      hidden: false,
      required: false,
      order: 26,
      controlOptions: { columnId: 'key', textField: 'value', hasSearch: true },
      columnCount: 3,
      validationLabels: { required: 'transfer.country-is-required' },
    }),

    poBox: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.po-box',
      required: true,
      validators: [],
      validationLabels: {
        required: 'transfer.beneficiary.international.po-box-is-required',
      },
      order: 27,
      value: '',
      columnCount: 3,
    }),
    cityState: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.city-state',
      required: false,
      validators: [{ validation: ValidationsEnum.EMAIL }],
      validationLabels: {
        required: 'transfer.email-required',
        pattern: 'transfer.email-format',
      },
      order: 28,
      value: '',
      columnCount: 3,
      disable: true,
    }),

    documentId: new TitleControl({
      hidden: false,
      columnCount: 12,
      order: 29,
      controlOptions: {
        id: '',
        title: 'transfer.beneficiary.international.document-id',
        type: 'Section',
      },
    }),

    idType: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.id-type',
      required: false,
      order: 30,
      value: '',
      columnCount: 3,
      disable: true,
    }),

    idNumber: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.id-number',
      required: false,
      order: 31,
      value: '',
      columnCount: 3,
      disable: true,
    }),

    IssuedAt: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.issued-at',
      required: false,
      order: 32,
      value: '',
      columnCount: 3,
      disable: true,
    }),

    issueDate: new TextInputControl({
      hidden: false,
      label: 'transfer.beneficiary.international.issue-date',
      required: false,
      order: 33,
      value: '',
      columnCount: 3,
      disable: true,
    }),
  };
}

export function detailsForm(): FormModel {
  return new FormModel({
    id: 'detailsForm',
    controls: {
      beneficiaryDetailsTable: new TableControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          headers: [
            {
              title: 'public.amount',
              type: TableHeaderType.AMOUNT_TEXT,
              fieldName: 'amount',
              controlOptions: {
                currency: 'currency',
              },
            },
            {
              title: 'public.date',
              type: TableHeaderType.DATE_TEXT,
              fieldName: 'date',
              controlOptions: { format: 'dd/MM/YYYY' },
            },
            {
              title: 'transfer.beneficiary.transaction-detail',
              type: TableHeaderType.TEXT,
              fieldName: 'detail',
            },
          ],
          exportFileName: 'Transaction-Details',
          data: [],
          columnId: 'companyPk',
          showFilter: false,
          pageSizes: [10, 15, 25],
          paginationValue: { page: 1, size: 10 },
          title: 'transfer.beneficiary.transaction-details',
        },
      }),
    },
  });
}

export function getSuccessfulForm() {
  return new FormModel({
    id: 'successfulPopUpForm',
    controls: {
      title: new TextControl({
        order: 1,
        columnCount: 12,
        label: 'transfer.beneficiary.beneficiary-edited-successfully',
        class: 'color-arb-primaryText font-h2-bold',
      }),
      okButton: new ButtonControl({
        order: 2,
        columnCount: 12,
        controlOptions: {
          id: 'ok',
          type: 'primary',
          text: 'public.ok',
        },
      }),
    },
  });
}

export function getModifyForm() {
  return new FormModel({
    id: 'moidiyPopUpForm',
    controls: {
      title: new TextControl({
        order: 1,
        columnCount: 12,
        label: 'transfer.beneficiary.edit-message',
        class: 'color-arb-primaryText font-h2-bold',
      }),
      cancelButton: new ButtonControl({
        order: 3,
        columnCount: 6,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'public.cancel',
        },
      }),
      deleteButton: new ButtonControl({
        order: 4,
        columnCount: 6,
        controlOptions: {
          id: 'modify',
          type: 'primary',
          text: 'transfer.beneficiary.modify',
        },
      }),
    },
  });
}

export function getDeleteForm() {
  return new FormModel({
    id: 'deletePopUpForm',
    controls: {
      title: new TextControl({
        order: 1,
        columnCount: 12,
        label: 'transfer.beneficiary.delete-question',
        class: 'text-start color-arb-primaryText font-h2-bold',
      }),
      subTitle: new TextControl({
        order: 2,
        columnCount: 12,
        label: 'transfer.beneficiary.delete-message',
        class: 'text-start color-arb-primaryText font-h2-light',
      }),
      cancelButton: new ButtonControl({
        order: 3,
        columnCount: 6,
        controlOptions: {
          id: 'cancel',
          type: 'secondary',
          text: 'public.cancel',
        },
      }),
      deleteButton: new ButtonControl({
        order: 4,
        columnCount: 6,
        controlOptions: {
          id: 'delete',
          type: 'danger',
          text: 'transfer.beneficiary.delete-beneficiary',
        },
      }),
    },
  });
}

export const deleteButton: ButtonModel = {
  id: 'delete',
  text: 'public.delete',
  type: 'danger',
  isDisable: false,
};
