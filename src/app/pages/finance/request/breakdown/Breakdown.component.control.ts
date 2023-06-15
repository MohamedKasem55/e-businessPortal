import {FormModel} from "../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {TextControl} from "../../../../@core/model/dto/control/text-control";

export const breakdownControl = () => {

  return new FormModel({
    id: 'breakdownForm',
    controls: {
      breakdown: new TitleControl({
        columnCount: 12,
        order: 1,
        class: "pb-3",

        controlOptions: {
          id: "breakdown-title",
          title: 'finance.fleet.requests.ViewBreakdown',
          type: 'Page',
          showArrow: true
        }
      }),
      "initialOffer": new TitleControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          id: "initialOffer-title",
          title: 'finance.fleet.requests.InitialOfferBreakdown',
          type: 'Section'
        }
      }),
      "Info": new TextControl({
        columnCount: 12,
        order: 3,
        label: 'finance.fleet.requests.Initial_Info',

      }),
    }
  })
}
