import {FormModel} from "../../../../../@core/model/dto/formModel";
import {TitleControl} from "../../../../../@core/model/dto/control/title-control";
import {GenericFeatureListControl} from "../../../../../@core/model/dto/control/generic-feature-list-control";
import {EmptyControl} from "../../../../../@core/model/dto/control/empty-control";
import {DropdownControl} from "../../../../../@core/model/dto/control/dropdown-control";
import {NumberInputControl} from "../../../../../@core/model/dto/control/number-input-control";


export const internalQuotForm = (purposeOfUseList: any, colors: any, purposeOfUse?: string): FormModel => {

  return new FormModel({
    id: 'internalQuotForm',
    controls: {
      fleetFinance: new TitleControl({
        columnCount: 8,
        order: 1,
        controlOptions: {
          id: "business-cards-details-title",
          title: 'finance.products.fleet',
          type: 'Section'
        }
      }),
      "internalQuot": new GenericFeatureListControl({
        label: "internal quot",
        columnCount: 6,
        order: 2,
        controlOptions: <any>{
          cardImg: "assets/img/product-select.svg",

        }
      }),
      empty: new EmptyControl({
        columnCount: 6,
        order: 3,
      }),


      brandName: new DropdownControl({
        hidden: false,
        label: 'finance.fleet.requests.brandName',
        required: true,
        order: 4,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'finance.fleet.requests.RequiredField'},
        controlOptions: {
          columnId: 'brandName',
          textField: 'brandName',
          options: [],
        },
      }),
      modelName: new DropdownControl({
        hidden: false,
        label: 'finance.fleet.requests.model',
        required: true,
        order: 5,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'finance.fleet.requests.RequiredField'},
        controlOptions: {
          columnId: 'modelName',
          textField: 'modelName',
          options: [],
        },
      }),
      vehicleVariant: new DropdownControl({
        hidden: false,
        label: 'finance.fleet.requests.variant',
        required: true,
        order: 6,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'finance.fleet.requests.RequiredField'},
        controlOptions: {
          columnId: 'vehicleVariant',
          textField: 'vehicleVariant',
          options: [],
        },
      }),
      modelYear: new DropdownControl({
        hidden: false,
        label: 'finance.fleet.requests.selectModelYear',
        required: true,
        order: 7,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'finance.fleet.requests.RequiredField'},
        controlOptions: {
          columnId: 'modelYear',
          textField: 'modelYear',
          options: [],
        },
      }),
      dealerName: new DropdownControl({
        hidden: false,
        label: 'finance.fleet.requests.dealershipName',
        required: true,
        order: 8,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'finance.fleet.requests.RequiredField'},
        controlOptions: {
          columnId: 'dealerName',
          textField: 'dealerName',
          options: [],
        },
      }),
      vehicleColor: new DropdownControl({
        hidden: false,
        label: 'finance.fleet.requests.exteriorColor',
        required: true,
        order: 9,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'finance.fleet.requests.RequiredField'},
        controlOptions: {
          columnId: 'vehicleColor',
          textField: 'txt',
          options: colors,
        },
      }),
      purposeOfUse: new DropdownControl({
        hidden: false,
        label: 'finance.fleet.requests.purposeOfUse',
        required: true,
        order: 10,
        value: '',
        columnCount: 6,
        validators: [],
        validationLabels: {
          required: 'finance.fleet.requests.RequiredField'
        },

        controlOptions: {
          columnId: 'purposeOfUse',
          textField: 'txt',
          options: purposeOfUseList,
        },
      }),

      vehiclesNum: new NumberInputControl({
        hidden: false,
        label: 'finance.fleet.requests.quantity',
        required: true,
        order: 11,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'finance.fleet.requests.RequiredField'},
      }),
      tenure: new NumberInputControl({
        hidden: false,
        label: 'finance.fleet.requests.tenure',
        required: true,
        order: 12,
        value: '',
        columnCount: 6,
        validators: [],
        validationLabels: {required: 'finance.fleet.requests.RequiredField'},
      }),
      downPmt: new NumberInputControl({
        hidden: false,
        label: 'finance.fleet.requests.downPayment',
        required: true,
        validators: [],
        order: 13,
        value: '',
        columnCount: 6,
        validationLabels: {required: 'finance.fleet.requests.RequiredField'},
      }),
      vehiclePrice: new NumberInputControl({
        hidden: false,
        label: 'finance.fleet.requests.vehiclePrice',
        required: true,
        order: 14,
        value: '',
        columnCount: 6,
        disable: true,
        validationLabels: {required: 'finance.fleet.requests.RequiredField'},
      }),
      purposeValue: new NumberInputControl({
        hidden: false,
        label: 'finance.fleet.requests.purposeofUseValue',
        required: true,
        order: 15,
        value: '',
        columnCount: 6,
        disable: true,
        validationLabels: {required: 'finance.fleet.requests.RequiredField'},
      }),



    }
  })
}
