import { LineCardControl } from "app/@core/model/dto/control/line-card-control"
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control"
import { TitleControl } from "app/@core/model/dto/control/title-control"
import { FormModel } from "app/@core/model/dto/formModel"

export const getCommodityDetailsControl = (financeAmount: string) => {
    return new FormModel({
        id: 'commodityDetails',
        controls: {
            pageTitle: new TitleControl({
                order: 1, columnCount: 12,
                controlOptions: { id: '', title: 'finance.execution.commodityDetails', type: 'Page' }
            }),
            card: new LineCardControl({
                order: 2, columnCount: 12,
                controlOptions: {
                    title: 'finance.execution.card'
                }
            }),
            commodityDetails: new TitleControl({
                order: 3, columnCount: 12,
                controlOptions: { id: '', title: 'finance.execution.commodityDetails', type: 'Section' }
            }),
            commodityType: new SummaryItemControl({
                order: 4, columnCount: 4,
                label: 'finance.execution.commodityType',
                value: 'finance.execution.commodityTypeValue'
            }),
            commodityWeight: new SummaryItemControl({
                order: 5, columnCount: 4,
                label: 'finance.execution.commodityWeight',
                value: ''
            }),
            commodityValue: new SummaryItemControl({
                order: 6, columnCount: 4,
                label: 'finance.execution.commodityValue',
                value: ''
            }),
            dateOfPurchase: new SummaryItemControl({
                order: 6, columnCount: 4,
                label: 'finance.execution.dateOfPurchase',
                value: ''
            }),

    }
  })
}
