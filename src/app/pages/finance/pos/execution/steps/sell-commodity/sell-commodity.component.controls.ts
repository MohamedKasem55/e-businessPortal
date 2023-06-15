import { DividerControl } from "app/@core/model/dto/control/divider-control"
import { LineCardControl } from "app/@core/model/dto/control/line-card-control"
import { SelectionControl } from "app/@core/model/dto/control/selection-control"
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control"
import { TextControl } from "app/@core/model/dto/control/text-control"
import { TitleControl } from "app/@core/model/dto/control/title-control"
import { FormModel } from "app/@core/model/dto/formModel"

export const getSellCommodityControl = (contractURL: any) => {
    return new FormModel({
        id: 'sellCommodity',
        controls: {
          pageTitle: new TitleControl({
              order: 1, columnCount: 12,
              controlOptions: {
                  id: '',
                  title: 'finance.execution.SellCommodity',
                  type: 'Page'
              }
          }),
          card: new LineCardControl({
              order: 2, columnCount: 12,
              controlOptions: {
                  title: "finance.execution.sellCard",
                  icon: "arb-icon-exclamationBorder"
              }
          }),
          commoditiesDetails: new TitleControl({
              order: 3, columnCount: 12,
              controlOptions: {
                  id: '',
                  title: 'finance.execution.SellCommodityDetails',
                  type: 'Section'
              }
          }),
          referenceNumber: new SummaryItemControl({
              order: 4, columnCount: 4,
              label: 'finance.execution.SellCommodityReff',
              value: '80,0000 SAR'
          }),
          divider: new DividerControl({
              order: 5, columnCount: 12,
              class: 'pt-4'
          }),
          text: new TextControl({
              order: 6, columnCount: 12,
              label: 'finance.execution.SellCommodityTxt'
          }),
          contractCommodity: new SelectionControl({
              order: 13, columnCount: 12,
              class: 'pt-4',
              controlOptions: {
                  title: [
                      { text: 'finance.execution.SellContract' },
                      { text: '', linkId: contractURL },
                  ],
              }
          })
      }
    })}
