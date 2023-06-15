import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { ValidationsEnum } from 'app/@core/model/dto/validations-enum';
import { FormModel } from "../../../@core/model/dto/formModel";


export function titleForm() {
  return new FormModel({
    id: 'inquiryDetails',
    showDivider: true,
    controls: {
      "title": new TitleControl({
        order: 1,
        columnCount: 12,
        label: "financial-products.inquiryDetails",
        controlOptions: {
          id: "info",
          type: 'Section',
          title: "financial-products.product",
          showArrow: false,
          subTitle: "",
        }
      }),
    }
  });
}


export function contactForm() {
  return new FormModel({
    id: 'contactForm',
    controls: {
      "organizationInfo": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "organizationInfo",
          title: 'financial-products.organizationInfo',
          type: 'Section',
        },
      }),
      "region": new DropdownControl({
        label: 'financial-products.region',
        order: 2,
        columnCount: 6,
        controlOptions: {
          columnId: "key",
          textField: 'value',
        },
        validationLabels: {
          required: 'financial-products.regionReq',
        }
      }),
      "city": new DropdownControl({
        label: 'financial-products.city',
        order: 3,
        columnCount: 6,
        controlOptions: {
          columnId: "key",
          textField: 'value',
        },
        validationLabels: {
          required: 'financial-products.cityReq',
        }
      }),
      "yearly": new DropdownControl({
        label: 'financial-products.yearlyIncome',
        order: 4,
        columnCount: 6,
        controlOptions: {
          columnId: "key",
          textField: 'value',
        },
        validationLabels: {
          required: 'financial-products.yearlyIncomeReq',
        }
      }),
      "contactInfo": new TitleControl({
        columnCount: 12,
        order: 5,
        controlOptions: {
          id: "contactInfo",
          title: 'financial-products.contactInfo',
          type: 'Section',
        },
      }),
      "name": new TextInputControl({
        order: 6,
        columnCount: 6,
        label: "financial-products.contactName",
        class: "text-start color-arb-primaryText",
        value: "",
        required: true,
        validationLabels: {
          required: 'financial-products.contactNameReq',
        }
      }),
      "phone": new TextInputControl({
        order: 7,
        columnCount: 6,
        label: "financial-products.phoneNum",
        class: "text-start color-arb-primaryText",
        value: "",
        required: true,
        // validators: [{validation: ValidationsEnum.MOBILE_NUMBER}],
        // validationLabels: {
        //   required: 'financial-products.phoneNumReq',
        // }
      }),
      "email": new TextInputControl({
        order: 8,
        columnCount: 6,
        label: "financial-products.contactEmail",
        class: "text-start color-arb-primaryText",
        value: "",
        required: true,
        validators: [{validation: ValidationsEnum.EMAIL}],
        validationLabels: {
          required: 'financial-products.contactEmailReq',
        }
      }),
      "bestToCall": new DropdownControl({
        label: 'financial-products.bestToCall',
        order: 9,
        columnCount: 6,
        controlOptions: {
          columnId: "key",
          textField: 'value',
        },
        validationLabels: {
          required: 'financial-products.bestToCallReq',
        }
      }),
    }
  });
}
