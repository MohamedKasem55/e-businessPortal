import { ButtonModel } from 'arb-design-library/model/button.model';
import { AccountControl } from 'app/@core/model/dto/control/account-control';
import { FormModel } from 'app/@core/model/dto/formModel';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { NumberInputControl } from 'app/@core/model/dto/control/number-input-control';

export function accountDetailsForm(): FormModel {
  return new FormModel({
      id: 'accountDetailsForm',
      controls: {
          "accountDetailsTitle": new TitleControl({
              order: 1,
              controlOptions: {
                  id: 'request-details',
                  title: 'company-admin.token-management.request-details',
                  subTitle: '',
              },
              columnCount: 12,
          }),
          "softTokenCount": new NumberInputControl({
            label: 'company-admin.token-management.num-soft-token',
            required: true,
            order: 2,
            value: '',
            columnCount: 6,
        }),
          "fromAccount": new AccountControl({
              label: 'public.from',
              required: true,
              hidden:false,
              order: 2,
              columnCount: 6,
              validationLabels: { required: 'transfer.account-is-required' },
          }),
          
      },
  })
}

export const getTokenManagementBackButton = (): ButtonModel => {
  return {id: 'GoBackToTokenManagement', text: 'company-admin.token-management.token-management-button', type: 'primary'}
}

export const getTokenOrderCancelButton = (): ButtonModel => {
  return {id: 'Cancel', text: 'public.cancel', type: 'secondary'}
}

export const getGoToDashboarButton = (): ButtonModel => {
  return {id: 'GoToDashBoard', text: 'public.go-to-dashboard', type: 'secondary'}
}