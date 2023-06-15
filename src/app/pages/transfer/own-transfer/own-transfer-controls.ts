import {AmountControl} from "app/@core/model/dto/control/amount-control";
import {DropdownControl} from "app/@core/model/dto/control/dropdown-control";
import {FormModel} from "app/@core/model/dto/formModel";
import {AccountControl} from "../../../@core/model/dto/control/account-control";
import {ButtonControl} from "../../../@core/model/dto/control/button-control";
import {TitleControl} from "../../../@core/model/dto/control/title-control";
import {ValidationsEnum} from "../../../@core/model/dto/validations-enum";
import {TextInputControl} from "../../../@core/model/dto/control/text-input-control";
import {EmptyControl} from "../../../@core/model/dto/control/empty-control";


export function accountsForm(): FormModel {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "fromTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "",
          title: 'transfer.from-account',
        }
      }),
      "fromAccountControl": new AccountControl({
        label: 'public.from',
        required: true,
        order: 2,
        value: null,
        columnCount: 6,
        validationLabels: {required: 'transfer.account-is-required'}
      }),
      "amountControl": new AmountControl({
        label: 'public.amount',
        required: true,
        order: 3,
        value: '',
        columnCount: 6,
        validators: [{validation: ValidationsEnum.MIN, options: "0.1"}],
        validationLabels: {
          min: "transfer.amount-is-required",
          required: 'transfer.amount-is-required',
          max: 'you exceed the maximum transfer limit'
        }
      }),
      "empty": new EmptyControl({
        columnCount: 12,
        order: 3,
      }),
      "switchButton": new ButtonControl({
        hidden: true,
        controlOptions: {
          id: 'SwitchAccounts',
          text: 'transfer.switch-accounts',
          type: 'secondary',
          prefixIcon: 'arb-icon-switchAccountSmall',
        },
        columnCount: 3,
        order: 4,
      }),
      "title": new TitleControl({
        columnCount: 12,
        order: 4,
        controlOptions: {
          id: "",
          title: 'transfer.to-account',
        }
      }),
      "toAccountControl": new AccountControl({
        label: 'public.to',
        required: true,
        value: null,
        order: 5,
        columnCount: 6,
        validationLabels: {required: 'transfer.account-is-required'}
      }),
      "currencyControl": new DropdownControl({
        label: 'public.currency',
        hidden: true,
        order: 6,
        controlOptions: {columnId: "key", textField: 'value',
          hasSearch: true,},
        columnCount: 6,
        validationLabels: {required: 'transfer.currency-is-required'}
      }),
      "remarksControl": new TextInputControl({
        label: 'transfer.remarks',
        required: false,
        order: 7,
        value: '',
        columnCount: 6,
      }),
    },
  });
}



