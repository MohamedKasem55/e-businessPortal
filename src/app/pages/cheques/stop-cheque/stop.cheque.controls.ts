import {FormModel} from "../../../@core/model/dto/formModel";
import {AccountControl} from "../../../@core/model/dto/control/account-control";
import {DropdownControl} from "../../../@core/model/dto/control/dropdown-control";
import {KeyValueModel} from "../../../@core/model/rest/common/key-value.model";
import {TextControl} from "../../../@core/model/dto/control/text-control";
import {TitleModel} from "arb-design-library/model/title.model";
import {NumberInputControl} from "../../../@core/model/dto/control/number-input-control";

export const deleteCheque = (): FormModel => {
  return new FormModel({
    id: 'deleteCheque',
    controls: {
      hint: new TextControl({
        columnCount: 12,
        order: 3,
        label: 'accounts.cheques.stop-type.stopMsg',
        class: "mt-2",
        controlOptions:{
          prefixIcon:"arb-icon-exclamationBorder fs-4 color-arb-primaryColor",
        }
      }),
      account: new AccountControl({
        columnCount: 4,
        order: 3,
        label: "public.account",
        required: true,
        class: "mt-5",
        validationLabels: {
          required: "public.validations.required",
        }
      }),
      checkBook: new DropdownControl({
        columnCount: 4,
        order: 3,
        label: "accounts.cheques.stop-type.name",
        required: true,
        class: "mt-5",
        validationLabels: {
          required: "public.validations.required",
        },
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: chequeStopType(),
        }
      }),
      chequeNumber: new NumberInputControl({
        columnCount: 4,
        order: 3,
        label: "accounts.cheques.chequeNo",
        required: true,
        class: "mt-5",
        value:"",
        validationLabels: {
          required: "public.validations.required",
        }
      }),
    },
  })
}
export const deleteChequePageTitle = (): TitleModel => {
  return {
    id: "stopPageTitle",
    type: 'Page',
    title: 'accounts.cheques.stop-type.stop',
    showArrow: true,
    stepper: {
      steps: ['', '', ''],
      stepCounter: 1,
      stepText: "public.step",
      ofText: "public.of"
    }
  }

}

export const chequeStopType = (): KeyValueModel[] => {
  return [{
    key: "1",
    value: "accounts.cheques.stop-type.1"
  }, {
    key: "2",
    value: "accounts.cheques.stop-type.2"
  }]
}
