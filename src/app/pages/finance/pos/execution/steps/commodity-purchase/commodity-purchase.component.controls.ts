import { DividerControl } from "app/@core/model/dto/control/divider-control"
import { LineCardControl } from "app/@core/model/dto/control/line-card-control"
import { SelectionControl } from "app/@core/model/dto/control/selection-control"
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control"
import { TextControl } from "app/@core/model/dto/control/text-control"
import { TitleControl } from "app/@core/model/dto/control/title-control"
import { FormModel } from "app/@core/model/dto/formModel"

export const getCommodityPurchaseControl = (dossierID: string,financeAmount: string, contractURL: any) => {
    return new FormModel({
        id: 'commodityPurchase',
        controls: {
            pageTitle: new TitleControl({
                order: 1, columnCount: 12,
                controlOptions: {
                    id: '',
                    title: 'finance.execution.commodityPurchase',
                    type: 'Page'
                }
            }),
            card: new LineCardControl({
                order: 2, columnCount: 12,
                controlOptions: {
                    title: 'finance.execution.commoditiesCard'
                }
            }),
            commoditiesDetails: new TitleControl({
                order: 3, columnCount: 12,
                controlOptions: {
                    id: '',
                    title: 'finance.execution.commoditiesDetails',
                    type: 'Section'
                }
            }),
            referenceNumber: new SummaryItemControl({
                order: 4, columnCount: 4,
                label: 'finance.execution.referenceNumber',
                value: dossierID
            }),
            divider: new DividerControl({
                order: 5, columnCount: 12,
                class: 'pt-4'
            }),
            text: new TextControl({
                order: 6, columnCount: 12,
                label: 'finance.execution.text'
            }),
            contractCommodity: new SelectionControl({
                order: 13, columnCount: 12,
                class: 'pt-4',
                controlOptions: {
                    title: [
                        { text: 'finance.execution.contractCommodityTEXT' },
                        { text: 'finance.execution.contractCommodity', linkId: contractURL },
                    ],
                }
            })
        }
    })
}
