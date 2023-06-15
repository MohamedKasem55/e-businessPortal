import {DropdownControl} from "app/@core/model/dto/control/dropdown-control";
import {TextInputControl} from "app/@core/model/dto/control/text-input-control";
import {TitleControl} from "app/@core/model/dto/control/title-control";
import {FormModel} from "app/@core/model/dto/formModel";
import {ValidationsEnum} from "app/@core/model/dto/validations-enum";
import {BoxModel} from "arb-design-library/model/box.model";
import {BoxListControl} from 'app/@core/model/dto/control/box-list-control';
import {RadioGroupControl} from "../../../../@core/model/dto/control/radio-group-control";
import { TableHeaderType } from "arb-design-library";
import { TableHeaderModel } from "arb-design-library/model/table-header.model";

export const returnBoxes: BoxModel[] = [
  {
    id: "alRajhi",
    text: 'transfer.beneficiary.al-rajhi',
    icon: 'arb-icon-Alrajhi',
    isDisabled: false

  }, {
    id: "local",
    text: 'transfer.beneficiary.local',
    icon: ' arb-icon-saudiBold',
    isDisabled: false
  },
  {
    id: "international",
    text: 'transfer.beneficiary.International',
    icon: 'arb-icon-world',
    isDisabled: false
  },
]

export function beneficiaryAddForm(): FormModel {
  return new FormModel({
    id: 'beneficiaryAddForm',
    controls: {
      "transferChannelTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          title: 'transfer.transfer-channel',
          type: 'Section', id: "",
        },
      }),
      "beneficiaryTypeBoxList": new BoxListControl({
        hidden: false,
        label: 'public.list',
        required: false,
        order: 2,
        value: 'alRajhi',
        controlOptions: {
          id: 'quickTransferList',
          action: 'onSelect',
          box: returnBoxes,
          columnCount: 3,
        },
        columnCount: 12,
        class: 'col-12'
      }),
      "benefBankTitle": new TitleControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          title: 'transfer.beneficiary-details',
          type: 'Section', id: "",
        },
      }),
      "accountNumber": new TextInputControl({
        hidden: false,
        label: 'public.account-number',
        required: true,
        order: 4,
        value: '',
        validators: [{
          validation: ValidationsEnum.MAX_LENGTH,
          options: "24"
        }, {validation: ValidationsEnum.ACCOUNTNUMBER}],
        validationLabels: {
          required: 'transfer.beneficiary.international.account-number-is-required',
          maxLength: 'transfer.max-length',
          translateOptions: {"0": '24'},
          pattern: 'transfer.beneficiary.account-number-format'
        },
        columnCount: 6,
      }),

      "name": new TextInputControl({
        hidden: false,
        label: 'public.name',
        required: false,
        order: 5,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'transfer.name-is-required'}
      }),
      "email": new TextInputControl({
        hidden: false,
        label: 'public.email-optional',
        required: false,
        validators: [{validation: ValidationsEnum.EMAIL}],
        validationLabels: {required: 'transfer.email-required', pattern: 'transfer.email-format'},
        order: 13,
        value: '',
        columnCount: 6,
      }),
      "nickName": new TextInputControl({
        hidden: false,
        label: 'public.nickname-optional',
        required: false,
        order: 14,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'transfer.surname-is-required'}
      }),
      "bankName": new DropdownControl({
        label: 'public.bank',
        hidden: true,
        required: false,
        order: 9,
        controlOptions: {
          columnId: "key",
          textField: 'bankName',
          hasSearch: true
        },
        columnCount: 6,
        validationLabels: {required: 'transfer.bank-is-required'},
      }),

      "benefTitle": new TitleControl({
        hidden: true,
        columnCount: 12,
        order: 10,
        controlOptions: {
          title: 'transfer.beneficiary-details',
          type: 'Section', id: "",
        },
      }),
      "beneficiaryName": new TextInputControl({
        hidden: true,
        label: 'transfer.beneficiary.beneficiary-name',
        required: false,
        order: 11,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'transfer.name-is-required'}
      }),
      "mobile": new TextInputControl({
        hidden: true,
        label: 'public.phone-number-optional',
        required: false,
        order: 12,
        value: '',
        validators: [{
          validation: ValidationsEnum.MAX_LENGTH,
          options: "9"
        }, {validation: ValidationsEnum.MOBILE_NUMBER}],
        validationLabels: {
          required: 'transfer.mobile-is-required',
          maxLength: 'transfer.max-length',
          translateOptions: {"0": '9'},
          pattern: 'transfer.mobile-format'
        },
        columnCount: 6,
      }),
      "countrySwift": new RadioGroupControl({
        hidden: true,
        label: 'transfer.beneficiary.beneficiary-name',
        required: false,
        order: 6,
        columnCount: 6,
        value: 'country',
        controlOptions: {
          options: [{
            id: 'country',
            title: 'transfer.beneficiary.country',
          }, {
            id: 'swift',
            title: 'transfer.beneficiary.swift'
          }], textOnStart: true
        }
      }),
      "swiftCode": new TextInputControl({
        hidden: true,
        updateOn:'blur',
        label: 'public.swiftCodeControl',
        required: false,
        disable: true,
        value: '',
        order: 7,
        columnCount: 6,
        validationLabels: {required: 'transfer.beneficiary.international.swift-code-is-required'}
      }),
      "country": new DropdownControl({
        label: 'public.country',
        hidden: true,
        required: false,
        order: 8,
        controlOptions: {columnId: "countryISO", textField: 'countryDesc', hasSearch: true},
        columnCount: 6,
        validationLabels: {required: 'transfer.country-is-required'}
      }),
      "currency": new DropdownControl({
        label: 'public.currency',
        hidden: true,
        required: false,
        order: 15,
        controlOptions: {columnId: "currencyCode", textField: 'currencyName',
          hasSearch: true,},
        columnCount: 6,
        validationLabels: {required: 'transfer.currency-is-required'}
      }),
      "branch": new DropdownControl({
        label: 'public.branch',
        hidden: true,
        required: false,
        order: 16,
        controlOptions: {columnId: "beneficiaryBankBranch", textField: 'beneficiaryBankBranch',
          hasSearch: true,},
        columnCount: 6,
        validationLabels: {required: 'transfer.branch-is-required'}
      }),
    }
  });
}

export function beneficiaryForm(): FormModel {
  return new FormModel({
    id: 'beneficiaryForm',
    controls: {
      "beneficiaryTitle": new TitleControl({
        hidden: true,
        columnCount: 12,
        order: 1,
        controlOptions: {
          title: 'transfer.beneficiary-details',
          type: 'Section', id: "",
        },
      }),
      "individualCompany": new RadioGroupControl({
        hidden: true,
        label: 'transfer.beneficiary.beneficiary-name',
        required: false,
        order: 2,
        value: 'individual',
        columnCount: 6,
        controlOptions: {
          options: [{
            id: 'individual',
            title: 'Individual'
          }, {
            id: 'company',
            title: 'Company'
          }], textOnStart: true
        }
      }),
    }
  });
}

export const AuthLevelSummaryHeaders = (
  status: { key: string; value: string }[]
): TableHeaderModel[] => {
  return [
    {
      title: 'pos.new-request.user-level',
      type: TableHeaderType.TEXT,
      fieldName: 'userLevel',
    },
    {
      title: 'pos.new-request.status',
      type: TableHeaderType.TEXT,
      fieldName: 'status',
      mapObject: status,
    },
    {
      title: 'pos.new-request.user-id',
      type: TableHeaderType.TEXT,
      fieldName: 'userId',
    },
    {
      title: 'pos.new-request.date-time',
      type: TableHeaderType.TEXT,
      fieldName: 'dateTime',
    },
  ];
};