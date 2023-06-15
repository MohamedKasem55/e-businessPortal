import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { ResultModal } from 'app/@core/model/dto/result.modal';
import { ButtonModel } from 'arb-design-library/model/button.model';

export function updateCRForm(): FormModel {
  return new FormModel({
    id: 'update-cr',
    controls: {
      updCR: new TitleControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          id: 'updCR',
          type: 'Section',
          title: 'update-cr.subtitle',
        },
      }),
      body: new TitleControl({
        order: 2,
        columnCount: 12,
        controlOptions: {
          id: 'body',
          title: '',
          subTitle: 'update-cr.body',
        },
      }),
    },
  });
}

export const cancelButton: ButtonModel = {
  id: 'Cancel',
  text: 'public.cancel',
  type: 'secondary',
};
export const updateButton: ButtonModel = {
  id: 'Update',
  text: 'update-cr.update',
  type: 'primary',
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
      text: 'update-cr.go-to-company-admin',
    },
  ];
};

export function fillSuccessResult(): ResultModal {
  return {
    type: 'Success',
    title: 'update-cr.updated',
    subTitle: 'update-cr.thank-you',
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
