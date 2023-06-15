import {TranslateService} from "@ngx-translate/core";
import { TextControl } from "app/@core/model/dto/control/text-control";
import { FormModel } from "app/@core/model/dto/formModel";

export const form = new FormModel({
  id: 'IneligibleUserForm',
  controls: {
    "title": new TextControl({
      order: 1,
      columnCount: 12,
      label: 'finance.fleet.requests.eligible_popTxt',
      class: "color-arb-primaryText font-h4-bold"
    }),
    "title1": new TextControl({
      order: 2,
      columnCount: 12,
      label: 'finance.fleet.requests.financingproduct',
      class: "color-arb-primaryText font-h4-bold"
    }),
    "subTitle": new TextControl({
      order: 3,
      columnCount: 12,
      label: 'finance.fleet.requests.eligible_popTxt2',
      class: "color-arb-secondaryText font-body-light text-start"
    }),
    "subTitle0": new TextControl({
      order: 4,
      columnCount: 12,
      label: 'finance.fleet.requests.visitbranch',
      class: "color-arb-secondaryText font-body-light text-start pb-3"
    }),
    "subTitle1": new TextControl({
      order: 5,
      columnCount: 12,
      label: 'finance.fleet.requests.Reasonsineligibility',
      class: "color-arb-secondaryText font-body-light text-start"
    }),

  }
});

export const getIneligibleUserForm = (translate: TranslateService) => {
  return form
}

