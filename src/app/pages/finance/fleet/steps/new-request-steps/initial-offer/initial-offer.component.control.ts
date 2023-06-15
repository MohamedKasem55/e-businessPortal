import {TitleControl} from '../../../../../../@core/model/dto/control/title-control';
import {FormModel} from '../../../../../../@core/model/dto/formModel';
import {TextControl} from '../../../../../../@core/model/dto/control/text-control';
import {SummaryItemControl} from '../../../../../../@core/model/dto/control/sumery-item-control';
import {ButtonControl} from '../../../../../../@core/model/dto/control/button-control';
import {DividerControl} from '../../../../../../@core/model/dto/control/divider-control';

export const initialOfferControl = (data: any) => {

  return new FormModel({
    id: 'initialOfferForm',
    controls: {

      "bankDocs": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "business-cards-details-title",
          title: 'finance.fleet.requests.initialOfferTitle',
          type: 'Section'
        }
      }),
      "Info": new TextControl({
        columnCount: 6,
        order: 2,

        label: 'finance.fleet.requests.initialOfferSubTitle',

      }),
      "AmountDetails": new TitleControl({
        columnCount: 12,
        order: 3,
        controlOptions: {
          id: "business-cards-details-title",
          title: 'finance.fleet.requests.initialamountDetails',
          type: 'Section'
        }
      }),
      "FinancingAmount": new SummaryItemControl({
        order: 4,
        columnCount: 4,
        label: 'finance.fleet.requests.requestedFinancingAmount',
        value: data?.totalReqFinanceAmt,
        controlOptions: {
          currency: '608',

        }
      }),
      "minDownPayment": new SummaryItemControl({
        order: 5,
        columnCount: 4,
        label: 'finance.fleet.requests.totalAdminFees',
        value: data?.totalAdminFee,
        controlOptions: {
          currency: '608',

        }
      }),
      "insurancePremium": new SummaryItemControl({
        order: 6,
        columnCount: 4,
        label: 'finance.fleet.requests.totalRepaymentAmt',
        value: data?.totalREPmtAmt,

      }),
      "adminFee": new SummaryItemControl({
        order: 7,
        columnCount: 4,
        label: 'finance.fleet.requests.totalDownPmt',
        value: data?.totalDownPmt,
        class: 'pb-3'
      }),

      breakdown: new ButtonControl({
        order: 8,
        columnCount: 2,
        class: '',
        controlOptions: {
          id: "breakdown",
          type: 'secondary',
          text: "finance.fleet.requests.viewBreakdown",

        }
      }),
      dividerSec: new DividerControl({
        columnCount: 12,
        order: 9,

      }),
      "installment": new TitleControl({
        columnCount: 12,
        order: 10,
        controlOptions: {
          id: "business-cards-details-title",
          title: 'finance.fleet.requests.installmentBreakdown',
          type: 'Section'
        }
      }),
    }
  })
}
