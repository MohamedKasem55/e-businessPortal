import { FormModel } from '../../../../../../@core/model/dto/formModel';
import { CustomerBusinessDetails } from '../../../../../../@core/model/rest/finance/request/business-details';
import { TitleControl } from '../../../../../../@core/model/dto/control/title-control';
import {
  CalenderType,
  DateControl,
} from '../../../../../../@core/model/dto/control/date-control';
import { TextInputControl } from '../../../../../../@core/model/dto/control/text-input-control';
import { NumberInputControl } from '../../../../../../@core/model/dto/control/number-input-control';
import { DropdownControl } from '../../../../../../@core/model/dto/control/dropdown-control';
import { KeyValueModel } from '../../../../../../@core/model/rest/common/key-value.model';

export function BusinessDetailsForm(
  formValue: CustomerBusinessDetails,
  disable: boolean,
  businessTypes?: KeyValueModel[],
  businessOutletsType?: KeyValueModel[],
  businessLocation?: KeyValueModel[]
): FormModel {
  return new FormModel({
    id: 'businessDetails',
    controls: {
      businessDetailsTitle: new TitleControl({
        columnCount: 12,
        order: 1,
        class: 'mt-4 mb-4',
        controlOptions: {
          title: 'finance.fleet.requests.businessDetails',
          type: 'Section',
          id: '',
          subTitle: 'finance.fleet.requests.initialOfferSubTitle',
        },
      }),
      establishmentDate: new DateControl({
        hidden: false,
        label: 'finance.fleet.requests.dateEstablishment',
        required: true,
        order: 2,
        columnCount: 4,

        validationLabels: { required: 'finance.pos.los.errorMsg' },
        value: {
          day: new Date(`${formValue?.establishmentDate}`).getDate(),
          month: new Date(`${formValue?.establishmentDate}`).getMonth() + 1,
          year: new Date(`${formValue?.establishmentDate}`).getFullYear(),
        },
        controlOptions: {
          displayPattern: 'dd/MM/yyyy',
          selectTodayText: 'public.select-today',
          applyText: 'public.apply',
          type: CalenderType.GREGORIAN,
        },
      }),

      businessActivities: new TextInputControl({
        hidden: false,
        label: 'finance.fleet.requests.businessActivity',
        required: true,
        order: 3,

        value: formValue?.businessActivity,
        columnCount: 4,
        validationLabels: { required: 'finance.pos.los.errorMsg' },
      }),

      businessOutletsNum: new NumberInputControl({
        hidden: false,
        label: 'finance.fleet.requests.numberOfBusiness',
        required: true,
        order: 4,

        value: formValue?.businessOutletsNum,
        columnCount: 4,
        validationLabels: { required: 'finance.pos.los.errorMsg' },
      }),

      businessType: new DropdownControl({
        order: 5,
        columnCount: 4,
        required: true,

        label: 'finance.fleet.requests.typeBusiness',
        class: 'text-start color-arb-primaryText ',
        value: formValue?.businessType,

        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: businessTypes,
        },
      }),
      businessOutletsType: new DropdownControl({
        order: 5,
        columnCount: 4,
        required: true,

        label: 'finance.fleet.requests.typeBranches',
        class: 'text-start color-arb-primaryText ',
        value: formValue?.branchType,

        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: businessOutletsType,
        },
      }),
      businessLocation: new DropdownControl({
        order: 5,
        columnCount: 4,
        required: true,

        label: 'finance.fleet.requests.primaryBusinessLocation',
        class: 'text-start color-arb-primaryText ',
        value: formValue?.businessLocation,

        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: businessLocation,
        },
      }),
    },
  });
}
