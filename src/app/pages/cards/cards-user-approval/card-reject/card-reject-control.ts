import {TranslateService} from "@ngx-translate/core";
import {FormModel} from "../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../@core/model/dto/control/title-control";
import {SummaryItemControl} from "../../../../@core/model/dto/control/sumery-item-control";
import {AccountControl} from "app/@core/model/dto/control/account-control";
import {RadioGroupControl} from "../../../../@core/model/dto/control/radio-group-control";
import {AmountControl} from "../../../../@core/model/dto/control/amount-control";

export function getBusinessCardDetailsForm(translate: TranslateService, data: any) {
  return new FormModel({
    id: 'business-cards-details',
    showDivider: true,
    controls: {
      "BusinessCardTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "business-cards-details-title",
          title: 'cards.business-cards-details',
        }
      }),
      "cardHolderName": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'cards.card-holder-name',
        value: data.accountAlias
      }),
      "cardNumber": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'cards.card-number',
        value: data.cardAccountNumber
      }),
      "relatedAccountName": new SummaryItemControl({
        columnCount: 4,
        order: 2,
        label: 'cards.related-account',
        value: data.accountNumber
      })
    }
  });
}


export function getPaymentDetailsForm(translate: TranslateService, data: any) {
  return new FormModel({
    id: 'payment-options-details',
    controls: {
      "BusinessCardTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "payment-options-details-title",
          title: 'cards.payment-options-details',
        }
      }),
      "fromAccountControl": new AccountControl({
        label: 'cards.account-selection',
        required: true,
        order: 2,
        value: null,
        columnCount: 5,
        validationLabels: {required: 'transfer.account-is-required'}
      }),
      "amountType": new RadioGroupControl({
        columnCount: 2,
        required: true,
        value: data.paymentOption,
        order: 2,
        controlOptions: {
          options: [
            {
              id: "0",
              title: 'cards.due-ammount'
            },
            {
              id: "1",
              title: 'cards.outstanding-ammount'
            },
            {
              id: "2",
              title: 'cards.custom'
            }
          ],
          textOnStart: false,
        }
      }),
      "amount": new AmountControl({
        columnCount: 2,
        required: true,
        label: 'cardsApproval.amount',
        order: 2,
        disable: true,
        value: data.amount
      }),
      "rejectedReason": new SummaryItemControl({
        columnCount: 3,
        order: 2,
        label: 'cards.rejected-reason',
        value: data.rejectedReason,
        disable: true
      }),
    }
  });
}
