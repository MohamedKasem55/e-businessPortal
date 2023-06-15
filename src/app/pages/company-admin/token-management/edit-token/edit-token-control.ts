import { ButtonModel } from 'arb-design-library/model/button.model';
import { FormModel } from 'app/@core/model/dto/formModel';
import { TitleControl } from 'app/@core/model/dto/control/title-control';
import { SummaryItemControl } from 'app/@core/model/dto/control/sumery-item-control';
import { DropdownControl } from 'app/@core/model/dto/control/dropdown-control';

export function editTokenForm(): FormModel {
  return new FormModel({
    id: 'editTokenForm',
    controls: {
      "tokenSerialNumber": new SummaryItemControl({
        label: 'company-admin.token-management.token-serial',
        order: 2,
        value: '',
        columnCount: 4,
      }),
      "tokenCurrentStatus": new SummaryItemControl({
        label: 'company-admin.token-management.token-status',
        order: 2,
        value: '',
        columnCount: 4,
      }),
      "tokenNewStatus": new DropdownControl({
        label: 'company-admin.token-management.new-status',
        order: 2,
        controlOptions: { textField: 'value', columnId: "key" },
        columnCount: 4,
        required: true,
        validationLabels: { required: 'company-admin.token-management.new-status-required' }
      }),
      "tokenType": new SummaryItemControl({
        label: 'company-admin.token-management.token-type',
        order: 3,
        value: '',
        columnCount: 4,
      }),
      "userId": new SummaryItemControl({
        label: 'company-admin.token-management.user-id',
        order: 3,
        value: '',
        columnCount: 4,
      }),
      "userName": new SummaryItemControl({
        label: 'company-admin.token-management.user-name',
        order: 3,
        value: '',
        columnCount: 4,
      }),
    },
  })
}

export const tokenStatusOptions = {
  BLOCKED: 'BLOCKED',
  NON_OPERATIVE: 'NON OPERATIVE',
  AVAILABLE: 'AVAILABLE',
  LOST: 'LOST'

} as const;


export const getTokenManagementBackButton = (): ButtonModel => {
  return { id: 'GoBackToTokenManagement', text: 'company-admin.token-management.token-management-button', type: 'primary' }
}

export const getTokenEditCancelButton = (): ButtonModel => {
  return { id: 'Cancel', text: 'public.cancel', type: 'secondary' }
}

export const getGoToDashboarButton = (): ButtonModel => {
  return { id: 'GoToDashBoard', text: 'public.go-to-dashboard', type: 'secondary' }
}