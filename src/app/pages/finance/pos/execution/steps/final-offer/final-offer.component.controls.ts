import { DividerControl } from "app/@core/model/dto/control/divider-control"
import { LineCardControl } from "app/@core/model/dto/control/line-card-control"
import { SelectionControl } from "app/@core/model/dto/control/selection-control"
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control"
import { TitleControl } from "app/@core/model/dto/control/title-control"
import { FormModel } from "app/@core/model/dto/formModel"

export const getFinalOfferControl = () => {
    return new FormModel({
        id: 'finalOffer',
        controls: {
            pageTitle: new TitleControl({
                order: 1, columnCount: 12,
                controlOptions: { id: '', title: 'finance.execution.finalOffer', type: 'Page' }
            }),
            financeDetails: new TitleControl({
                order: 2, columnCount: 12,
                class: 'pt-4',
                controlOptions: { id: '', title: 'finance.execution.financeDetails', type: 'Section' }
            }),
            accountNumber: new SummaryItemControl({
                order: 3, columnCount: 4,
                label: 'finance.execution.accountNumber',
            }),
            contractNumber: new SummaryItemControl({
                order: 4, columnCount: 4,
                label: 'finance.execution.contractNumber',
            }),
            posDossierID: new SummaryItemControl({
                order: 5, columnCount: 4,
                label: 'finance.execution.posDossierID',
            }),
            financeAmount: new SummaryItemControl({
                order: 6, columnCount: 4,
                label: 'finance.execution.financeAmount',
                controlOptions: {
                    currency: '608'
                }
            }),
            financingTenure: new SummaryItemControl({
                order: 7, columnCount: 4,
                label: 'finance.execution.financingTenure',
            }),
            installmentAmount: new SummaryItemControl({
                order: 8, columnCount: 4,
                label: 'finance.execution.installmentAmount',
                controlOptions: { currency: '608' }
            }),
            profitRate: new SummaryItemControl({
                order: 9, columnCount: 4,
                label: 'finance.execution.profitRate',
            }),
            totalProfit: new SummaryItemControl({
                order: 10, columnCount: 4,
                label: 'finance.execution.totalProfit',
            }),
            adminFee: new SummaryItemControl({
                order: 11, columnCount: 4,
                label: 'finance.execution.adminFee',
            }),
            totalPayment: new SummaryItemControl({
                order: 12, columnCount: 4,
                label: 'finance.execution.totalPayment',
                controlOptions: { currency: '608' }
            }),
            divider: new DividerControl({
                order: 13,
                columnCount: 12
            }),
            checkProcess: new LineCardControl({
                order: 14, columnCount: 12,
                controlOptions: {  title: 'finance.execution.checkProcess' }
            }),
            acceptPosGateway: new SelectionControl({
                order: 15, columnCount: 12,
                class: 'pt-2',
                controlOptions: {
                    title: [
                        { text: 'finance.execution.acceptPosGateway' },
                    ],
                }
            })
        }
    })
}
