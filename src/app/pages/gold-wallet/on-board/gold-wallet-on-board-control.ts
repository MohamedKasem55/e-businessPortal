import { AccountControl } from "app/@core/model/dto/control/account-control";
import { ImageControl } from "app/@core/model/dto/control/image-control";
import { PdfViewerControl } from "app/@core/model/dto/control/pdfviewer-control";
import { SelectionControl } from "app/@core/model/dto/control/selection-control";
import { TextControl } from "app/@core/model/dto/control/text-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";


export function getGoldWalletOnBoardForm() {
  return new FormModel({
    id: 'gold-wallet-on-board',
    showDivider: true,
    controls: {
      "ObBoardTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "on-board-title",
          title: "goldWallet.onBoard.open-text",
        },
      }),
      "image": new ImageControl({
        columnCount: 4,
        order: 1,
        controlOptions:{
          src:"assets/img/gold.png",
          class:"img-responsive center-block d-block mx-auto"
        },
      }),
    }
  });
}

export function getGoldWalletOnBoardFormAccount() {
  return new FormModel({
    id: 'gold-wallet-on-board',
    showDivider: true,
    controls: {
      "selectAccountTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "on-board-title",
          title: "payments.select-account",
        },
      }),
      "account": new AccountControl({
        label: 'payments.select-account',
        required: true,
        order: 6,
        value: null,
        controlOptions: {
          columnId:'key',
          textField: ['alias', 'fullAccountNumber'],
          endTextField: 'availableBalance',
          endTextCurrencyField: 'currency',
          options: []
        },
        columnCount: 4,
        validationLabels: { required: 'payments.select-account-is-required' }
    }),

    }
  });
}

export function termsForm(): FormModel {
  return new FormModel({
    id: 'termsForm',
    showDivider: false,
    controls: {
      "text":new TextControl({
        order: 2,
        columnCount: 12,
        label: "goldWallet.onBoard.agreements",
        class: "font-h4-light",
        controlOptions:{
          prefixIcon:"arb-icon-exclamationBorder"
        }
      }),
      "pdf": new PdfViewerControl({
        required: true,
        order: 3,
        controlOptions: {
          src:''
        },
        columnCount: 12,
        class: 'col-12'
      }),
      "check": new SelectionControl({
        order: 4,
        columnCount: 12,
        required: false,
        validators: [],
        controlOptions: {
          title: [{text: 'goldWallet.onBoard.terms',
                  linkId: 'terms-link'} ]
        },
      }),
    },
  });
}

