import {TitleControl} from "app/@core/model/dto/control/title-control"
import {FormModel} from "app/@core/model/dto/formModel"

export const getSummaryControl = () => {
  return new FormModel({
    id: 'summary',
    controls: {
      pageTitle: new TitleControl({
        order: 1, columnCount: 12,
        controlOptions: {id: 'initialOfferTitle', title: 'Summary', type: 'Page'}
      }),
    }
  })
}
