import {FormModel} from "../../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../../@core/model/dto/control/title-control";
import {LineCardControl} from "../../../../../@core/model/dto/control/line-card-control";
import {DividerControl} from "../../../../../@core/model/dto/control/divider-control";
import {SelectionControl} from "../../../../../@core/model/dto/control/selection-control";
import {TextControl} from "../../../../../@core/model/dto/control/text-control";

export const contractConfirmation = (contractURL: any) => {
  return new FormModel({
    id: 'contractConfirmation',
    controls: {
      contractDetails: new TitleControl({
        columnCount: 12,
        order: 1,
        class: "pb-3",
        controlOptions: {
          id: "business-cards-details-title",
          title: 'finance.fleet.offerAcceptance.contractDetails',
          type: 'Section'
        }
      }),
      "requiredInfo": new LineCardControl({
        columnCount: 12,
        order: 2,
        controlOptions: {
          title: 'finance.fleet.offerAcceptance.readContractText',
          icon: "arb-icon-exclamationBorder"
        }
      }),
      dividerSec: new DividerControl({
        columnCount: 12,
        order: 3,

      }),
      "termsAndConditions": new SelectionControl({
        order: 4,
        columnCount: 8,
        controlOptions: {
          title: [{
            text: 'finance.fleet.newRequest.iAgreeWith',
          },
            {
              text: "finance.fleet.newRequest.termsConditions",
              linkId: contractURL,
            }],
          value: true,
          textOnStart: false
        }
      }),
      "subTitle": new TextControl({
        order: 15,
        columnCount: 12,
        label: 'finance.fleet.requests.initialOfferNote',
        class: "color-arb-secondaryText font-body-light text-start"
      }),

    }
  })
}

