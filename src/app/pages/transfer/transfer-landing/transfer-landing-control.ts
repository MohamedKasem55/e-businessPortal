import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";

export function sariePopupForm() {
  return new FormModel({
    id: 'sariePopupForm',
    controls: {
      "sarieTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "seriaTitle",
          title: 'transfer.alias-management',
          subTitle:'transfer.sarie-message'
        }
      }),
      "laterButton": new ButtonControl({
        columnCount: 4,
        order: 2,
        controlOptions: {
          id: "later",
          type: 'secondary',
          text: "public.remind-later"
        }
      }),
      "rejectedButton": new ButtonControl({
        columnCount: 4,
        order: 2,
        controlOptions: {
          id: "rejected",
          type: 'secondary',
          text: "transfer.reject"
        }
      }),
      "acceptedButton": new ButtonControl({
        columnCount: 4,
        order: 2,
        controlOptions: {
          id: "accepted",
          type: 'primary',
          text: "transfer.accept"
        }
      }),
    }
  })
}
