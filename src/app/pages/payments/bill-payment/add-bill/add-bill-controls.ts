import {FormModel} from "../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {EmptyControl} from "../../../../@core/model/dto/control/empty-control";
import {DropdownControl} from "../../../../@core/model/dto/control/dropdown-control";
import {TextInputControl} from "../../../../@core/model/dto/control/text-input-control";
import {NumberInputControl} from "../../../../@core/model/dto/control/number-input-control";

export function addBillForm() {
  return new FormModel({
    id: 'addBillFrom',
    controls: {
      "providersForm": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "",
          title: 'payments.add-bill.select-provider',
        }
      }),
      "providerCategory": new DropdownControl({
        label: 'payments.add-bill.select-category',
        hidden: false,
        required: true,
        order: 2,
        controlOptions: {columnId: "key", textField: 'value', hasSearch: true},
        columnCount: 6,
        validationLabels: {required: 'payments.add-bill.select-category-is-required'}
      }),
      "providerName": new DropdownControl({
        label: 'payments.add-bill.select-provider',
        hidden: false,
        required: true,
        order: 3,
        controlOptions: {columnId: "billCode", textField: 'value', hasSearch: true},
        columnCount: 6,
        validationLabels: {required: 'payments.add-bill.select-provider-is-required'}
      }),
      "empty": new EmptyControl({
        columnCount: 12,
        order: 4,
      }),
      "providerDetails": new TitleControl({
        columnCount: 12,
        order: 5,
        controlOptions: {
          id: "",
          title: 'payments.add-bill.provider-details',
        }
      }),
      "subscriptionNumber": new NumberInputControl({
        label: 'payments.add-bill.subscription-number',
        required: true,
        order: 6,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'payments.add-bill.subscription-number-is-required'}
      }),
      "nickName": new TextInputControl({
        label: 'payments.add-bill.nickName',
        required: true,
        order: 7,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'payments.add-bill.nick-name-is-required'}
      }),
    },

  });
}

