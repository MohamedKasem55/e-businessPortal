import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { FormModel } from 'app/@core/model/dto/formModel';

export function gwDetailForm() {
  return new FormModel({
    id: 'gw-details',
    showDivider: true,
    controls: {
      "walletNum": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: "gold-wallet.details.walletNum",
        value: ""
      }),
      "refNum": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: "gold-wallet.details.refNum",
        value: ""
      }),
      "goldCode": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: "gold-wallet.details.goldCode",
        value: ""
      }),
      "paidFrom": new SummaryItemControl({
        columnCount: 4,
        order: 3,
        label: "gold-wallet.details.paidFrom",
        value: ""
      }),
      "amount": new SummaryItemControl({
        columnCount: 4,
        order: 3,
        label: "gold-wallet.details.amount",
        value: ""
      }),
      "purity": new SummaryItemControl({
        columnCount: 4,
        order: 3,
        label: "gold-wallet.details.purity",
        value: ""
      }),
      "goldSource": new SummaryItemControl({
        columnCount: 4,
        order: 4,
        label: "gold-wallet.details.goldSource",
        value: ""
      }),
      "goldVendor": new SummaryItemControl({
        columnCount: 4,
        order: 4,
        label: "gold-wallet.details.goldVendor",
        value: ""
      }),
      "timestamp": new SummaryItemControl({
        columnCount: 4,
        order: 4,
        label: "gold-wallet.details.timestamp",
        value: "-"
      }),
      "transactionStatus": new SummaryItemControl({
        columnCount: 4,
        order: 5,
        label: "gold-wallet.details.transactionStatus",
        value: ""
      }),
      "transactionType": new SummaryItemControl({
        columnCount: 4,
        order: 5,
        label: "gold-wallet.details.transactionType",
        value: ""
      })
    }
  });
}
