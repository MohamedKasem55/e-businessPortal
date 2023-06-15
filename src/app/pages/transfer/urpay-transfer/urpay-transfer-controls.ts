import { AccountControl } from '../../../@core/model/dto/control/account-control';
import { ValidationsEnum } from '../../../@core/model/dto/validations-enum';
import { TextInputControl } from '../../../@core/model/dto/control/text-input-control';
import { BoxModel } from 'arb-design-library/model/box.model';
import { PillControl } from '../../../@core/model/dto/control/pill-control';
import { BoxListControl } from 'app/@core/model/dto/control/box-list-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { AmountControl } from 'app/@core/model/dto/control/amount-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { PhoneControl } from '../../../@core/model/dto/control/phone-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';

const boxList: BoxModel[] = [
  {
    id: 'mobile',
    text: 'transfer.quick-transfer.proxy.mobile',
    icon: 'arb-icon-Smartphone',
    isDisabled: false,
  },
  {
    id: 'iban',
    text: 'transfer.urpay-transfer.IBAN',
    icon: 'arb-icon-bank',
    isDisabled: false,
  },
];

export function proxyForm(): FormModel {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      transferChannelTitle: new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: '',
          title: 'transfer.transfer-channel',
        },
      }),
      proxy: new BoxListControl({
        required: true,
        order: 2,
        value: 'mobile',
        controlOptions: {
          id: 'urpayTransferList',
          action: 'onSelect',
          box: boxList,
          columnCount: 4,
        },
        columnCount: 12,
        class: 'col-12',
      }),
      benefTitle: new TitleControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          id: '',
          title: 'transfer.beneficiary-details',
        },
      }),
      mobile: new PhoneControl({
        label: 'public.mobile',
        required: true,
        order: 4,
        value: '',
        controlOptions: {
          phonePrefix: '+966',
        },
        validators: [
          {
            validation: ValidationsEnum.MAX_LENGTH,
            options: '9',
          },
          { validation: ValidationsEnum.MOBILE_NUMBER },
        ],
        validationLabels: {
          required: 'transfer.mobile-is-required',
          maxLength: 'transfer.max-length',
          translateOptions: { '0': '9' },
          pattern: 'transfer.mobile-format',
        },
        columnCount: 6,
      }),
      iban: new TextInputControl({
        hidden: true,
        disable: true,
        label: 'transfer.urpay-transfer.IBAN',
        required: true,
        order: 5,
        value: 'SA',
        columnCount: 6,
        validators: [
          {
            validation: ValidationsEnum.MAX_LENGTH,
            options: '24',
          },
          { validation: ValidationsEnum.IBAN },
        ],
        validationLabels: {
          required: 'transfer.iban-is-required',
          maxLength: 'transfer.max-length',
          translateOptions: { '0': '24' },
          pattern: 'transfer.iban-format',
        },
      }),
    },
  });
}

export function accountForm(): FormModel {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      benefPill: new PillControl({
        columnCount: 2,
        order: 3,
        controlOptions: {
          text: 'URPAY TRANSFER #1',
          type: 'Neutral',
        },
      }),
      benefTitle: new TitleControl({
        order: 6,
        controlOptions: {
          id: 'details',
          title: '',
          subTitle: '',
        },
        columnCount: 12,
      }),
      fromAccount: new AccountControl({
        label: 'public.account-number',
        required: true,
        order: 8,
        value: null,
        columnCount: 6,
        validationLabels: { required: 'transfer.account-is-required' },
      }),
      amount: new AmountControl({
        label: 'public.amount',
        required: true,
        order: 9,
        value: '',
        columnCount: 6,
        validators: [{ validation: ValidationsEnum.MIN, options: '1' }],
        validationLabels: {
          min: 'transfer.amount-is-required',
          required: 'transfer.amount-is-required',
          max: 'transfer.maximum-transfer-limit',
        },
      }),
      detailsTitle: new TitleControl({
        columnCount: 12,
        order: 10,
        controlOptions: {
          id: '',
          title: 'transfer.urpay-transfer.transfer-details',
        },
      }),
      accountTitle: new TitleControl({
        columnCount: 12,
        order: 7,
        controlOptions: {
          id: '',
          title: 'transfer.urpay-transfer.account-details',
        },
      }),
      // "purpose": new DropdownControl({
      //   required: true,
      //   label: 'public.purpose',
      //   order: 11,
      //   controlOptions: {columnId: 'purposeDescriptionEn' textField: 'purposeDescriptionEn'},
      //   columnCount: 6,
      //   validationLabels: {required: 'transfer.currency-is-required'}
      // }),
      remarks: new TextInputControl({
        label: 'transfer.remarks-optional',
        required: false,
        order: 12,
        value: '',
        columnCount: 6,
      }),
    },
  });
}
