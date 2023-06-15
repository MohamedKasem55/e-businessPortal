import { ButtonControl } from "app/@core/model/dto/control/button-control";
import { SummaryItemControl } from "app/@core/model/dto/control/sumery-item-control";
import { TextControl } from "app/@core/model/dto/control/text-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";

export function initiateCredentialDetailsForm() {
    return new FormModel({
        id: 'credentialDetailsForm',
        controls: {
          "timerText": new TextControl({
            columnCount: 12,
            order: 1,
            label:"",
            class:"font-h4-bold color-arb-primaryText",
            controlOptions: {

            }
          }),
          "prepaidCardCredentialTitle": new TitleControl({
            columnCount: 12,
            order: 2,
            controlOptions: {
              id: "card-credential-title",
              title: "cards.credential-form.card-type",
            }
          }),
            "cardName": new SummaryItemControl({
              columnCount: 6,
              order: 3,
              label: "cards.card-name",
              value: "",
            }),
            "cardNumber": new SummaryItemControl({
              columnCount: 6,
              order: 3,
              label: "cards.credential-form.account-number",
              value: "",
            }),
            "expiryDate": new SummaryItemControl({
              columnCount: 6,
              order: 3,
              label: "cards.expiry-date",
              value: "",
            }),
            "cvv": new SummaryItemControl({
              columnCount: 6,
              order: 3,
              label: "cards.prepaid-card.cvv",
              value: "123",
            }),
            "copyCardNumber": new ButtonControl({
              columnCount: 6,
              order: 4,
              controlOptions: {
                id: "copy",
                type: 'secondary',
                text: "cards.prepaid-card.copy-account-number"
              }
            }),
            "closeButton": new ButtonControl({
                columnCount: 6,
                order: 4,
                controlOptions: {
                  id: "close",
                  type: 'primary',
                  text: "public.close"
                }
            }),

        }
    })
  }
