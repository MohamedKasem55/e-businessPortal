import { AccountControl } from '../../../@core/model/dto/control/account-control';
import { ValidationsEnum } from '../../../@core/model/dto/validations-enum';
import { TextInputControl } from '../../../@core/model/dto/control/text-input-control';
import { BoxModel } from 'arb-design-library/model/box.model';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { AmountControl } from 'app/@core/model/dto/control/amount-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { BoxListControl } from '../../../@core/model/dto/control/box-list-control';
import { PhoneControl } from '../../../@core/model/dto/control/phone-control';

export const boxList: BoxModel[] = [
  {
    id: 'iban',
    text: 'transfer.quick-transfer.proxy.iban',
    icon: 'arb-icon-bank',
    isDisabled: false,
  },
  {
    id: 'mobile',
    text: 'transfer.quick-transfer.proxy.mobile',
    icon: 'arb-icon-Smartphone',
    isDisabled: false,
  },
  {
    id: 'email',
    text: 'transfer.quick-transfer.proxy.email',
    icon: 'arb-icon-envelope',
    isDisabled: false,
  },
  {
    id: 'nationalId',
    text: 'transfer.quick-transfer.proxy.nationalId',
    icon: 'arb-icon-userInsideBorder',
    isDisabled: false,
  },
];

export function proxyForm(): FormModel {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      transferChannelTitleControl: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: '',
          title: 'transfer.transfer-channel',
          type: 'Section',
        },
      }),
      proxy: new BoxListControl({
        required: true,
        order: 2,
        value: 'iban',
        controlOptions: {
          id: 'quickTransferList',
          action: 'onSelect',
          box: boxList,
          columnCount: 4,
        },
        columnCount: 12,
        class: 'col-12',
      }),
      benefTitleControl: new TitleControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          id: '',
          title: 'transfer.beneficiary-details',
          type: 'Section',
        },
      }),
      ibanControl: new TextInputControl({
        label: 'transfer.urpay-transfer.IBAN',
        required: true,
        order: 4,
        value: 'SA',
        validators: [
          { validation: ValidationsEnum.MAX_LENGTH, options: '24' },
          { validation: ValidationsEnum.IBAN },
        ],
        validationLabels: {
          required: 'transfer.iban-is-required',
          maxLength: 'transfer.max-length',
          translateOptions: { '0': '24' },
          pattern: 'transfer.iban-format',
        },
        columnCount: 6,
      }),
      mobileControl: new PhoneControl({
        label: 'public.mobile',
        hidden: true,
        disable: true,
        controlOptions: {
          phonePrefix: '+966',
        },
        validators: [
          { validation: ValidationsEnum.MAX_LENGTH, options: '9' },
          { validation: ValidationsEnum.MOBILE_NUMBER },
        ],
        required: true,
        order: 5,
        value: '',
        validationLabels: {
          required: 'transfer.mobile-is-required',
          maxLength: 'transfer.max-length',
          translateOptions: { '0': '9' },
          pattern: 'transfer.mobile-format',
        },
        columnCount: 6,
      }),
      nationalIdControl: new TextInputControl({
        hidden: true,
        label: 'public.national-id',
        disable: true,
        required: true,
        validators: [
          { validation: ValidationsEnum.MAX_LENGTH, options: '10' },
          { validation: ValidationsEnum.NATIONALID },
        ],
        validationLabels: {
          required: 'transfer.national-required',
          maxLength: 'transfer.max-length',
          translateOptions: { '0': '10' },
          pattern: 'transfer.national-format',
        },
        order: 6,
        value: '',
        columnCount: 6,
      }),
      emailControl: new TextInputControl({
        hidden: true,
        label: 'public.email',
        required: true,
        disable: true,
        validators: [{ validation: ValidationsEnum.EMAIL }],
        validationLabels: {
          required: 'transfer.email-required',
          pattern: 'transfer.email-format',
        },
        order: 7,
        value: '',
        columnCount: 6,
      }),
      bankNameControl: new DropdownControl({
        label: 'public.select-bank-name',
        required: true,
        order: 8,
        controlOptions: {
          columnId: 'participantFullName',
          textField: 'participantFullName',
          hasSearch: true,
        },
        columnCount: 6,
        validationLabels: { required: 'transfer.bank-is-required' },
      }),
      nameControl: new TextInputControl({
        label: 'public.name',
        required: true,
        order: 9,
        value: '',
        columnCount: 6,
        validationLabels: { required: 'transfer.name-is-required' },
      }),
      surnameControl: new TextInputControl({
        label: 'public.surname',
        required: true,
        order: 10,
        value: '',
        columnCount: 6,
        validationLabels: { required: 'transfer.surname-is-required' },
      }),
      accountTitleControl: new TitleControl({
        columnCount: 12,
        order: 11,
        controlOptions: {
          id: '',
          title: 'transfer.urpay-transfer.account-details',
          type: 'Section',
        },
      }),
      fromAccountControl: new AccountControl({
        label: 'public.from',
        required: false,
        order: 12,
        value: null,
        columnCount: 6,
        validationLabels: { required: 'transfer.account-is-required' },
      }),
      amountControl: new AmountControl({
        label: 'public.amount',
        required: true,
        order: 13,
        value: '',
        columnCount: 6,
        validators: [{ validation: ValidationsEnum.MIN, options: '1' }],
        validationLabels: {
          min: 'transfer.amount-is-required',
          required: 'transfer.amount-is-required',
          max: 'you exceed the maximum transfer limit',
        },
      }),
      detailsTitleControl: new TitleControl({
        columnCount: 12,
        order: 14,
        controlOptions: {
          id: '',
          title: 'transfer.urpay-transfer.transfer-details',
          type: 'Section',
        },
      }),
      purposeControl: new DropdownControl({
        label: 'public.purpose',
        required: true,
        order: 15,
        controlOptions: {
          columnId: 'key',
          textField: 'purposeDescriptionEn',
          hasSearch: true,
        },
        columnCount: 6,
        validationLabels: { required: 'transfer.purpose-is-required' },
      }),
      remarksControl: new TextInputControl({
        label: 'transfer.remarks',
        order: 16,
        value: '',
        columnCount: 6,
      }),
    },
  });
}
