import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { PopupInputModel } from 'app/@core/model/dto/popup.model';
import { ButtonModel } from 'arb-design-library/model/button.model';
import { FormModel } from "../../../@core/model/dto/formModel";

export const getTableTitle =(): ButtonModel[] => {
  return [
    {
      id: "download",
      type: 'secondary',
      prefixIcon: "arb-icon-arrowDownBox",
      text: "gold-wallet.dashboard.download"
    }
  ]
}

export const getEndButtons =(): ButtonModel[] => {
  return [
    {
      id: "sell",
      type: 'secondary',
      prefixIcon: " arb-icon-cart",
      text: "gold-wallet.dashboard.sell"
    },
    {
      id: "buy",
      type: 'primary',
      prefixIcon: "arb-icon-gold",
      text: "gold-wallet.dashboard.buy"
    }
  ]
}

export const getDetailForm = (): PopupInputModel =>{
  let form: FormModel = new FormModel({
    id: 'fromAccountForm',
    controls: {
      "date": new SummaryItemControl({
        columnCount: 6,
        order: 2,
        label: "payments.userApproval.date",
        value: ""
      }),
      "amount": new SummaryItemControl({
        columnCount: 6,
        order: 3,
        label: "payments.userApproval.amount",
        value: ""
      }),
      "sponsorId": new SummaryItemControl({
        columnCount: 6,
        order: 4,
        label: "payments.userApproval.govStatus.sponsorId",
        value: ""
      }),
      "account": new SummaryItemControl({
        columnCount: 6,
        order: 5,
        label: "payments.userApproval.account",
        value: "3049299adm-4"
      })
    }
  })
  return {
    form: form
  }
}


