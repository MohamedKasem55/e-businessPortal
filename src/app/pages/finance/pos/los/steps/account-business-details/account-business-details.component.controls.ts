import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { NumberInputControl } from 'app/@core/model/dto/control/number-input-control';
import { SelectionControl } from 'app/@core/model/dto/control/selection-control';
import { TextInputControl } from 'app/@core/model/dto/control/text-input-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';

export const getAccountBusinessDetailsControl = (
  accountList: KeyValueModel[] | [],
  accountValue?: KeyValueModel,
  TypeOfBrunches?: KeyValueModel[] | [],
  TypeOfLocation?: KeyValueModel[] | [],
) => {
  return new FormModel({
    id: 'accountBusinessDetails',
    controls: {
      pageTitle: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: 'accountBusinessDetailsTitle',
          title: 'finance.pos.los.FinancingAccountandBusinessDetails',
          type: 'Page',
        },
      }),
      financingAccountTitle: new TitleControl({
        order: 2,
        columnCount: 12,
        class: 'pt-4',
        controlOptions: {
          id: 'financingAccount',
          title: 'finance.pos.los.FinancingAccount',
          subTitle: 'finance.pos.los.FinancingAccountSubTitle',
          type: 'Section',
        },
      }),
      selectAccount: new DropdownControl({
        order: 3,
        columnCount: 6,
        class: 'pt-4',
        label: 'finance.pos.los.selectAccount',
        required: true,
        value: accountValue,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: accountList,
        },
      }),
      businessDetailsTitle: new TitleControl({
        order: 4,
        columnCount: 12,
        class: 'pt-4 pb-2',
        controlOptions: {
          id: 'businessDetails',
          title: 'finance.pos.los.BusinessDetails',
          type: 'Section',
        },
      }),
      numberBusinessBranches: new NumberInputControl({
        order: 6,
        columnCount: 4,
        label: 'finance.pos.los.numberBusinessBranches',
        validators: [],
        required: true,
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        value: '',
      }),
      typeBranches: new DropdownControl({
        order: 7,
        columnCount: 4,
        label: 'finance.pos.los.typeBranches',
        validators: [],
        required: true,
        value: '',
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: TypeOfBrunches,
        },
      }),
      primaryBusinessLocation: new DropdownControl({
        order: 8,
        columnCount: 4,
        label: 'finance.pos.los.primaryBusinessLocation',
        required: true,
        validators: [],
        value: '',
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: TypeOfLocation,
        },
      }),
      businessModelSalesPattern: new TextInputControl({
        order: 9,
        columnCount: 4,
        label: 'finance.pos.los.businessModelSalesPattern',
        validators: [],
        required: true,
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        value: '',
      }),
      termsConditions: new SelectionControl({
        order: 14,
        columnCount: 12,
        class: 'pt-4',
        required: true,
        validators: [],
        validationLabels: { required: 'finance.pos.los.errorMsg' },
        controlOptions: {
          value: true,
          title: [
            { text: 'finance.pos.los.agreeTerms' },
            {
              text: 'finance.pos.los.termsConditions',
              linkId: 'terms-conditions',
            },
          ],
          textOnStart: false,
        },
      }),
    },
  });
};
