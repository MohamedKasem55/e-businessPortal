import {FormModel} from "./@core/model/dto/formModel";
import {TextControl} from "./@core/model/dto/control/text-control";
import {ButtonControl} from "./@core/model/dto/control/button-control";
import {TranslateService} from "@ngx-translate/core";


export const getIdleForm = (translate: TranslateService) => {
  return new FormModel({
    id: 'idleForm',
    controls: {
      "title": new TextControl({
        order: 1,
        columnCount: 12,
        label: 'public.warning',
        class: "color-arb-primaryText font-h2-bold justify-content-center"
      }),
      "subTitle": new TextControl({
        order: 2,
        columnCount: 12,
        label: 'public.idleMessage',
        class: "color-arb-primaryText font-h2-light justify-content-center"
      }),
      "cancelButton": new ButtonControl({
        order: 3,
        columnCount: 6,
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.logout"
        }
      }),
      "renewButton": new ButtonControl({
        order: 4,
        columnCount: 6,
        controlOptions: {
          id: "renewButton",
          type: 'primary',
          text: "public.keep-login"
        }
      }),
    }
  })
}
