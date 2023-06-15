import { ButtonControl } from 'app/@core/model/dto/control/button-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';
import { SelectionControl } from 'app/@core/model/dto/control/selection-control';
import { TextControl } from 'app/@core/model/dto/control/text-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { ValidationsEnum } from 'app/@core/model/dto/validations-enum';
import { KeyValueModel } from 'app/@core/model/rest/common/key-value.model';
import { ButtonModel } from 'arb-design-library/model/button.model';
import {Utils} from "../../../@core/utility/Utils";

export function accessForm(): FormModel {
  return new FormModel({
    id: 'accessForm',
    controls: {
      title: new TextControl({
        order: 1,
        columnCount: 12,
        label: 'accounts.add.dear',
        class: 'color-arb-primaryText font-h2-bold',
      }),
      subTitle: new TextControl({
        order: 2,
        columnCount: 12,
        label: 'accounts.add.sorry',
        class: 'color-arb-primaryText font-h2-light',
      }),
      backButton: new ButtonControl({
        order: 3,
        columnCount: 12,
        controlOptions: {
          id: 'Back',
          type: 'secondary',
          text: 'public.back',
        },
      }),
    },
  });
}

export function addAccForm(
  currencies: KeyValueModel[],
  branches: KeyValueModel[]
): FormModel {
  return new FormModel({
    id: 'addAccForm',
    controls: {
      enterInfo: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: 'enterInfo',
          title: 'accounts.add.enter-info',
        },
      }),
      currency: new DropdownControl({
        order: 2,
        columnCount: 6,
        label: 'accounts.currency',
        required: true,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            { field: 'accounts.currency' }
          ),
        },
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: currencies,
          hasSearch: true,
        },
      }),
      branch: new DropdownControl({
        order: 3,
        columnCount: 6,
        label: 'accounts.branch',
        required: true,
        disable: true,
        validationLabels: {
          required: Utils.translateWithParams(
            'public.is-required',
            { field: 'accounts.branch' }
          ),
        },
        controlOptions: {
          columnId: 'key',
          textField: 'value',
          options: branches,
          hasSearch: true,
        },
      }),
      terms: new SelectionControl({
        order: 4,
        columnCount: 12,
        label: 'accounts.add.terms-conditions',
        required: true,
        validators: [{ validation: ValidationsEnum.TRUE }],
        validationLabels: {
          required: 'accounts.add.required-terms',
        },
        controlOptions: {
          title: [
            {
              text: 'accounts.add.agree',
            },
            {
              text: 'accounts.add.terms-conditions',
              linkId: 'terms-link',
            },
          ],
        },
      }),
    },
  });
}

export const submitButton: ButtonModel = {
  id: 'Submit',
  text: 'accounts.add.submit',
  type: 'primary',
};

export const getEndButtons = (): ButtonModel[] => {
  return [
    {
      id: 'goToAccounts',
      type: 'primary',
      text: 'accounts.goToAccounts',
    },
  ];
};
