import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { TextControl } from "app/@core/model/dto/control/text-control";
import { FormModel } from "app/@core/model/dto/formModel";


export function getErrorForm() {
  return new FormModel({
    id: 'fromAccountForm',
    controls: {
      "title": new TextControl({
        order: 1,
        columnCount: 12,
        label: 'public.error',
        class: "color-arb-primaryText font-h2-bold justify-content-center",
      }),
      "subTitle": new TextControl({
        order: 2,
        columnCount: 12,
        label: 'gold-wallet.elegibility-error',
        class: "color-arb-primaryText font-h2-light justify-content-center"
      }),
      "goHomeButton": new ButtonControl({
        order: 2,
        columnCount: 12,

        controlOptions: {
          id: "delete",
          type: 'primary',
          text: "gold-wallet.goDashboard",
        },
        class:"justify-content-center"
      }),
    }
  })
}
