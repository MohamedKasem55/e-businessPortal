import {DropdownControl} from "app/@core/model/dto/control/dropdown-control";
import {TextInputControl} from "app/@core/model/dto/control/text-input-control";
import {FormModel} from "app/@core/model/dto/formModel";
import {ButtonModel} from "arb-design-library/model/button.model";
import {TitleControl} from "app/@core/model/dto/control/title-control";
import {AccountControl} from "app/@core/model/dto/control/account-control";


export function getOneTimePaymentTypeForm() {
  return new FormModel({
    id: 'oneTimePaymentTypeForm',
    controls: {
      "serviceProvider": new DropdownControl({
        label: 'payments.oneTimeBillPayment.serviceProvider',
        required: true,
        order: 1,
        columnCount: 6,
        controlOptions: {
          columnId: "billCode",
          textField: 'value',
          hasSearch: true
        },
        validationLabels: { required: 'payments.oneTimeBillPayment.service-provider-is-required' }
      }),
      "subscriptionNumber": new TextInputControl({
        label: 'payments.oneTimeBillPayment.subscriptionNumber',
        required: true,
        order: 2,
        columnCount: 6,
        value: '',
        validationLabels: { required: 'payments.oneTimeBillPayment.subscriptionNumber-is-required' }
      }),
      "selectAccount": new AccountControl({
        label: 'payments.oneTimeBillPayment.selectAccount',
        required: false,
        order: 3,
        columnCount: 6,
        validationLabels: { required: 'payments.oneTimeBillPayment.account-is-required' },
        controlOptions: {
          columnId: 'accountPk',
          textField: ['alias', 'fullAccountNumber'],
          hasSearch: false,
          endTextField: 'availableBalance',
          endTextCurrencyField: 'currency',
          options: [],
          disabledField: "disabled",
        }
      }),

    }
  })
}

export function getOneTimePaymentTypeAndaAmountForm(): FormModel {
  return new FormModel({
    id: 'oneTimePaymentAndAmountForm',
    controls: {
      "transferChannelTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          title: 'payments.oneTimeBillPayment.title',
          type: 'Section', id: "",
        },
      }),
      "billProvider": new TextInputControl({
        hidden: false,
        label: 'payments.oneTimeBillPayment.billProvider',
        required: false,
        order: 1,
        value: '',
        columnCount: 6,
        tempData: true,
        disable: true,
      }),
      "billNumber": new TextInputControl({
        hidden: false,
        label: 'payments.oneTimeBillPayment.billNumber',
        required: false,
        order: 2,
        value: '',
        columnCount: 6,
        disable: true,
      }),
      "billAmount": new TextInputControl({
        hidden: false,
        label: 'payments.oneTimeBillPayment.billAmount',
        required: false,
        order: 3,
        value: '',
        columnCount: 6,
        disable: true,
      }),
      "amount": new TextInputControl({
        hidden: false,
        label: 'payments.oneTimeBillPayment.amount',
        required: true,
        order: 4,
        value: '',
        columnCount: 6,
        validationLabels: { required: 'payments.oneTimeBillPayment.amount-is-required' }
      }),

    }
  })




}


export const getEndButtons = (): ButtonModel[] => {
  return [{
    id: "goToDashboard",
    type: 'secondary',
    text: "public.go-to-dashboard"
  },
    {
      id: "goToPayAnotherBills",
      type: 'primary',
      text: "payments.oneTimeBillPayment.pay-another-bills"
    }
  ]
}
