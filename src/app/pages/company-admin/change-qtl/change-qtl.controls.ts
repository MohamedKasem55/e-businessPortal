import { NumberInputControl } from 'app/@core/model/dto/control/number-input-control';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { ValidationsEnum } from 'app/@core/model/dto/validations-enum';
import { ButtonModel } from 'arb-design-library/model/button.model';

export function changeQTLForm(qtl: string, maxQtl:string): FormModel {
  return new FormModel({
    id: 'change-qtl',
    controls: {
      subtitleQTL: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: 'subtitleQTL',
          type: 'Section',
          title: 'change-qtl.subtitle',
        },
      }),
      qtlLimit: new NumberInputControl({
        order: 2,
        columnCount: 6,
        required: true,
        validators: [
          { validation: ValidationsEnum.MAX, options: maxQtl },
        ],
        label: '',
        value: qtl,
      }),
    },
  });
}

export const cancelButton: ButtonModel = {
  id: 'Cancel',
  text: 'public.cancel',
  type: 'secondary',
};

export const getEndButtons = (): ButtonModel[] => {
  return [
    {
      id: 'goToDashboard',
      type: 'secondary',
      text: 'public.go-to-dashboard',
    },
    {
      id: 'goToCompanyAdmin',
      type: 'primary',
      text: 'change-qtl.go-to-company-admin',
    },
  ];
};

export function fillSuccessResult(): ResultModal {
  return {
    type: 'Success',
    title: 'change-qtl.congratulations',
    summary: undefined,
  };
}

export function fillErrorResult(errString?: string): ResultModal {
  return {
    type: 'Error',
    title: errString || '',
    summary: undefined,
  };
}
