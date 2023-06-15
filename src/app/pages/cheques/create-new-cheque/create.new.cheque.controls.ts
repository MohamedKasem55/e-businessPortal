import {FormModel} from "../../../@core/model/dto/formModel";
import {AccountControl} from "../../../@core/model/dto/control/account-control";
import {DropdownControl} from "../../../@core/model/dto/control/dropdown-control";
import {TitleModel} from "arb-design-library/model/title.model";
import {KeyValueModel} from "../../../@core/model/rest/common/key-value.model";

export const createCheque = (): FormModel => {
  return new FormModel({
    id: 'createCheque',
    controls: {
      account: new AccountControl({
        columnCount: 6,
        order: 3,
        label: "public.account",
        required: true,
        class: "mt-5",
        validationLabels: {
          required: "public.validations.required",
        }
      }),
      checkBook: new DropdownControl({
        columnCount: 6,
        order: 3,
        label: "accounts.cheques.chequeType",
        required: true,
        class: "mt-5",
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: chequeType(),
        },
        validationLabels: {
          required: "public.validations.required",
        }
      }),
    },
  })
}
export const createChequePageTitle = (): TitleModel => {
  return {
    id: "chequePageTitle",
    type: 'Page',
    title: 'accounts.cheques.reqNewChequeBook',
    showArrow: true,
    stepper: {
      steps: ['', '', ''],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    }
  }

}

export const chequeType = (): KeyValueModel[] => {
  return [{
    key: "2",
    value: "accounts.cheques.pages.25"
  }, {
    key: "3",
    value: "accounts.cheques.pages.50"
  }]
}
