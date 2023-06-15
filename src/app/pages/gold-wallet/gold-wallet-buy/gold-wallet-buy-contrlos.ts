import { TranslateService } from '@ngx-translate/core';
import { BoxListControl } from 'app/@core/model/dto/control/box-list-control';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { GoldComponentControl } from 'app/@core/model/dto/control/gold-component-control';
import { SelectionControl } from 'app/@core/model/dto/control/selection-control';
import { TextControl } from 'app/@core/model/dto/control/text-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { PopupInputModel } from 'app/@core/model/dto/popup.model';
import { FormModel } from "../../../@core/model/dto/formModel";


export function buyForm(translate: TranslateService): FormModel {
  return new FormModel({
    id: 'buyForm',
    showDivider: false,
    controls: {
      "header": new GoldComponentControl({
        columnCount: 12,
        order: 1,
        controlOptions:{
          title: translate.instant('gold-wallet.goldBalance'),
          balance:'',
          balanceCurrency:'',
          note: translate.instant('gold-wallet.marketInfo'),
          prices:[],
          duration:0
        },
      }),
      "weight":new TextControl({
        columnCount: 12,
        order: 1,
        label: "gold-wallet.buy.selectWeight",
        class: "font-h2-bold",
      }),
      "text":new TextControl({
        order: 2,
        columnCount: 12,
        label: "gold-wallet.buy.info",
        class: "font-h4-light",
        controlOptions:{
          prefixIcon:"arb-icon-exclamationBorder"
        }
      }),
      "listBoxType": new BoxListControl({
        required: true,
        order: 3,
        value: 'P',
        controlOptions: {
          id: 'weightList',
          action: 'onSelect',
          box: [],
          columnCount:3
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
          title: [{text: 'gold-wallet.buy.custom'} ]
        },
      }),
      "amount": new TextInputControl({
        order: 5,
        columnCount: 6,
        label: "gold-wallet.buy.amountOptional",
        class: "text-start color-arb-primaryText",
        value: "",
        hidden: true
      }),
      "textCustom":new TextControl({
        order: 6,
        columnCount: 12,
        label: "gold-wallet.buy.infoCustom",
        class: "font-h4-light",
        controlOptions:{
          prefixIcon:"arb-icon-exclamationBorder"
        },
        hidden: true
      }),
    },
  });
}

export function getModalForm() {
  return new FormModel({
    id: 'modalForm',
    controls: {
      "title": new TextControl({
        order: 1,
        columnCount: 12,
        label: 'gold-wallet.timeUp',
        class: "color-arb-primaryText font-h2-bold justify-content-center",
      }),
      "subTitle": new TextControl({
        order: 2,
        columnCount: 12,
        label: 'gold-wallet.timaUpMessage',
        class: "color-arb-primaryText font-h2-light justify-content-center"
      }),
      "goBack": new ButtonControl({
        order: 2,
        columnCount: 12,

        controlOptions: {
          id: "backTimer",
          type: 'primary',
          text: "gold-wallet.goBack",
        },
        class:"justify-content-center"
      }),
    }
  })
}


export function headerForm(translate: TranslateService): FormModel {
  return new FormModel({
    id: 'headerForm',
    showDivider: false,
    controls: {
      "header": new GoldComponentControl({
        columnCount: 12,
        order: 1,
        controlOptions:{
          title: translate.instant('gold-wallet.goldBalance'),
          balance:'',
          balanceCurrency:'',
          note: translate.instant('gold-wallet.marketInfo'),
          prices:[],
          duration:0
        },
      })
    },
  });
}

export const getDetailForm = (): PopupInputModel =>{
  let form: FormModel = new FormModel({
    id: 'details'
  })
  return {
    form: form
  }
}
