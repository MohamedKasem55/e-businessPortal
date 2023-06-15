import {FormModel} from '../../../../../@core/model/dto/formModel';
import {TitleControl} from '../../../../../@core/model/dto/control/title-control';
import {NumberInputControl} from '../../../../../@core/model/dto/control/number-input-control';
import {DropdownControl} from '../../../../../@core/model/dto/control/dropdown-control';
import {UploadControl} from '../../../../../@core/model/dto/control/upload-control';
import {TextInputControl} from '../../../../../@core/model/dto/control/text-input-control';
import {ButtonModel} from 'arb-design-library/model/button.model';


export function quotationPurpose(type: string, id: string, showUploadFile: boolean,
                                 hideDeleteBtn: boolean, title: string, purposeOfUseList: any, colors: any, purposeOfUse?: string): FormModel {
  return new FormModel(
    {
      id: id,
      controls: {
        uploadQuotationTitle: new TitleControl({
          columnCount: 12,
          order: 1,
          class: 'mt-4 mb-4',
          controlOptions: {
            title: title,
            type: 'Section', id: '',
            subTitle: '',
            endButtons: type === 'quotation' ? [
                {
                  id: 'add_purpose',
                  text: 'finance.fleet.requests.AddPurpose',
                  type: 'primary',
                  prefixIcon: '',
                },
              ]
              : [],
          },
        }),

        col: new TitleControl({
          columnCount: 12,
          order: 1,
          class: 'mt-4 mb-4',
          controlOptions: {
            title: '',
            type: 'Section', id: '',
            subTitle: '',
            endButtons: hideDeleteBtn
              ? []
              : [
                {
                  id: 'deleteButton',
                  text: 'public.delete',
                  type: 'danger',
                  prefixIcon: '',
                },
              ],
          },
        }),
        purposeOfUse: new DropdownControl({
          hidden: false,
          label: 'finance.fleet.requests.purposeOfUse',
          required: true,
          order: 3,
          value: '',
          columnCount: 3,
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

        brandName: new DropdownControl({
          hidden: false,
          label: 'finance.fleet.requests.brandName',
          required: true,
          order: 4,
          value: '',
          columnCount: 3,
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
          columnCount: 3,
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
          columnCount: 3,
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
          columnCount: 3,
          validationLabels: {required: 'finance.fleet.requests.RequiredField'},
          controlOptions: {
            columnId: 'modelYear',
            textField: 'modelYear',
            options: [],
          },
        }),
        vehiclesNum: new NumberInputControl({
          hidden: false,
          label: 'finance.fleet.requests.quantity',
          required: true,
          order: 8,
          value: '',
          columnCount: 3,
          validationLabels: {required: 'finance.fleet.requests.RequiredField'},
        }),
        tenure: new NumberInputControl({
          hidden: false,
          label: 'finance.fleet.requests.tenure',
          required: true,
          order: 9,
          value: '',
          columnCount: 3,
          validators: [],
          validationLabels: {required: 'finance.fleet.requests.RequiredField'},
        }),
        downPmt: new NumberInputControl({
          hidden: false,
          label: 'finance.fleet.requests.downPayment',
          required: true,
          validators: [],
          order: 10,
          value: '',
          columnCount: 3,
          validationLabels: {required: 'finance.fleet.requests.RequiredField'},
        }),
        vehiclePrice: new NumberInputControl({
          hidden: false,
          label: 'finance.fleet.requests.vehiclePrice',
          required: true,
          order: 11,
          value: '',
          columnCount: 3,
          validationLabels: {required: 'finance.fleet.requests.RequiredField'},
        }),
        purposeValue: new NumberInputControl({
          hidden: false,
          label: 'finance.fleet.requests.purposeofUseValue',
          required: true,
          order: 12,
          value: '',
          columnCount: 3,
          disable: true,
          validationLabels: {required: 'finance.fleet.requests.RequiredField'},
        }),
        vehicleColor: new DropdownControl({
          hidden: false,
          label: 'finance.fleet.requests.exteriorColor',
          required: true,
          order: 13,
          value: '',
          columnCount: 3,
          validationLabels: {required: 'finance.fleet.requests.RequiredField'},
          controlOptions: {
            columnId: 'vehicleColor',
            textField: 'txt',
            options: colors,
          },
        }),
        dealerName: new DropdownControl({
          hidden: false,
          label: 'finance.fleet.requests.dealershipName',
          required: true,
          order: 14,
          value: '',
          columnCount: 3,
          validationLabels: {required: 'finance.fleet.requests.RequiredField'},
          controlOptions: {
            columnId: 'dealerName',
            textField: 'dealerName',
            options: [],
          },
        }),
        fileInfo: new UploadControl({
          hidden: !showUploadFile,
          label: 'finance.fleet.requests.document',
          required: true,
          order: 15,
          value: '',
          columnCount: 3,
          validationLabels: {required: 'finance.fleet.requests.RequiredField'},
          controlOptions: {
            acceptedTypes: ['.jpeg', '.pdf', '.gif', '.jpg', '.png'],
          },
        }), documentsInfo: new TextInputControl({
          hidden: true,
          label: '',
          required: false,
          order: 12,
          value: '',
          columnCount: 16,
        }),

        campaign: new TextInputControl({
          hidden: true,
          label: '',
          required: false,
          order: 12,
          value: 'finance.fleet.requests.StandardProduct',
          columnCount: 16,
        }),
        vehicleType: new TextInputControl({
          hidden: true,
          label: '',
          required: false,
          order: 12,
          value: 'New Vehicle',
          columnCount: 16,
        }),
        gracePeriod: new TextInputControl({
          hidden: true,
          label: '',
          required: false,
          order: 12,
          value: '0',
          columnCount: 16,
        }),
        gracePeriodType: new TextInputControl({
          hidden: true,
          label: '',
          required: false,
          order: 12,
          value: '',
          columnCount: 16,
        }),
        profitRate: new NumberInputControl({
          hidden: true,
          label: '',
          required: false,
          order: 12,
          value: '0',
          columnCount: 16,
        }),
        pmtFrequency: new TextInputControl({
          hidden: true,
          label: '',
          required: false,
          order: 12,
          value: '',
          columnCount: 16,
        }),
        ballonPmt: new NumberInputControl({
          hidden: true,
          label: '',
          required: false,
          order: 12,
          value: '0',
          columnCount: 16,
        }),

      },
    });
}

export function addPurposeBtn(): ButtonModel {
  return {
    id: 'add_purpose',
    text: 'finance.fleet.requests.AddPurpose',
    type: 'primary',
    prefixIcon: '',
  };
}
