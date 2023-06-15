import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { FormModel } from "app/@core/model/dto/formModel";
import { ButtonModel } from "arb-design-library/model/button.model";


export function updateNickNameForm(): FormModel {
  return new FormModel({
    id: 'updateNickName',
    controls: {
      "nickname": new TextInputControl({
        hidden: false,
        disable: false,
        label: 'public.nickname',
        required: true,
        order: 1,
        value: '',
        columnCount: 6,
        validationLabels: { required: 'accounts.nickname-is-required' }
      })

    }
  });
}

export const getSummaryEndButton = (): ButtonModel[] => {
  return [{
    id: "to-dashboard",
    type: 'secondary',
    text: "accounts.goToDashBoard"
  }, {
    id: "goToAccounts",
    type: 'primary',
    text: "accounts.goToAccounts"
  }
  ]
}

