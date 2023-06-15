import { TranslateService } from '@ngx-translate/core';
import { BoxListControl } from 'app/@core/model/dto/control/box-list-control';
import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { GoldComponentControl } from 'app/@core/model/dto/control/gold-component-control';
import { TableControl } from 'app/@core/model/dto/control/table-control';
import { TextControl } from 'app/@core/model/dto/control/text-control';
import { PopupInputModel } from 'app/@core/model/dto/popup.model';
import { TableHeaderType } from 'arb-design-library';
import { FormModel } from "../../../@core/model/dto/formModel";


export function sellForm(translate: TranslateService): FormModel {
  return new FormModel({
    id: 'sellForm',
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
          prices:[]
        },
      }),
      "weight":new TextControl({
        columnCount: 12,
        order: 1,
        label: "gold-wallet.buy.selectWeight",
        class: "font-h2-bold",
      }),
      "listBoxType": new BoxListControl({
        required: true,
        order: 3,
        value: '',
        controlOptions: {
          id: 'weightList',
          action: 'onSelect',
          box: [],
          columnCount:3
        },
        columnCount: 12,
        class: 'col-12'
      }),
    },
  });
}

export const getSellTableCustom = (): FormModel => {
  return new FormModel({
    id: 'sellTableCustom',
    controls: {
      sellTableCustom: new TableControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          headers: [
            {
              title: "gold-wallet.sell.serialNum",
              fieldName: "serialNumber",
              type: TableHeaderType.TEXT
            },
            {
              title: "gold-wallet.sell.weight",
              fieldName: "amount",
              type: TableHeaderType.TEXT
            },
            {
              title: "gold-wallet.sell.source",
              fieldName: "goldSource",
              type: TableHeaderType.TEXT
            },
            {
              title: "gold-wallet.sell.purity",
              fieldName: "purity",
              type: TableHeaderType.TEXT
            },
            {
              title: "gold-wallet.sell.choosen",
              fieldName: "choosen",
              type: TableHeaderType.TEXT_INPUT,
            },
          ],
          columnId: "serialNumber",

          hasCheckbox: true,
          showSearch: false,
          showFilter: true,
          pageSizes: [5, 10, 20],
          paginationValue: {page: 1, size: 10}
        },
      })
    }

  })
}

export const getSellTable = (): FormModel => {
  return new FormModel({
    id: 'sellTable',
    controls: {
      sellTable: new TableControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          headers: [
            {
              title: "gold-wallet.sell.serialNum",
              fieldName: "serialNumber",
              type: TableHeaderType.TEXT
            },
            {
              title: "gold-wallet.sell.weight",
              fieldName: "amount",
              type: TableHeaderType.TEXT
            },
            {
              title: "gold-wallet.sell.source",
              fieldName: "goldSource",
              type: TableHeaderType.TEXT
            },
            {
              title: "gold-wallet.sell.purity",
              fieldName: "purity",
              type: TableHeaderType.TEXT
            }
          ],
          columnId: "serialNumber",

          hasCheckbox: true,
          showSearch: false,
          showFilter: true,
        },
      })
    }

  })
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
          prices:[]
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
