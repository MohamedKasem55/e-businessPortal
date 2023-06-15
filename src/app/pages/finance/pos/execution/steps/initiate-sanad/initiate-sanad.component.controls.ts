import { GenericFeatureListControl } from "app/@core/model/dto/control/generic-feature-list-control"
import { ImageControl } from "app/@core/model/dto/control/image-control"
import { LineCardControl } from "app/@core/model/dto/control/line-card-control"
import { TitleControl } from "app/@core/model/dto/control/title-control"
import { FormModel } from "app/@core/model/dto/formModel"

export const getInitiateSanadControl = () => {
  return new FormModel({
    id: 'initiateSanad',
    controls: {
      pageTitle: new TitleControl({
        order: 1, columnCount: 12,
        controlOptions: { id: '', title: 'finance.execution.initiateSanad', type: 'Page' }
      }),
      card: new LineCardControl({
        order: 2, columnCount: 12,
        controlOptions: {
          title: 'finance.execution.initiateSanadCard',
          icon: "arb-icon-exclamationBorder"
        }
      }),
      image: new ImageControl({
        columnCount: 3,
        order: 3,

        controlOptions: {
          class: '',
          src: 'assets/img/contract.png'
        }
      }),
      sanad: new GenericFeatureListControl({
        columnCount: 5,
        order: 4,
        controlOptions: <any>{
          title: "finance.execution.sanadSteps",
          icon: "arb-icon-userGroup",
          features: [
            { text: 'finance.execution.SANAD1' },
            { text: 'finance.execution.SANAD2' },
            { text: 'finance.execution.SANAD3' },
            { text: 'finance.execution.SANAD4' },
            { text: 'finance.execution.SANAD5' },
          ]
        }
      })
    }
  })
}
