import {TitleModel} from "arb-design-library/model/title.model";
import {ButtonModel} from "arb-design-library/model/button.model";


export const getUserBasePageTitle = (): TitleModel => {
  return {
    id: '',
    title: '',
    stepper: {
      steps: ["", "", ""],
      stepCounter: 1,
      stepText: 'public.step',
      ofText: 'public.of'
    }
  }
}

export const getUserBaseDeleteButton = (): ButtonModel => {
  return {
    id: "Delete",
    text: "public.delete",
    type: "danger"
  }
}
export const getUserBaseBackButton = (): ButtonModel => {
  return {id: "Back", text: "public.back", type: "secondary"}
}

export const getUserBaseNextButton = (): ButtonModel => {
  return {id: "Next", text: 'public.next', type: "primary", isDisable: false}
}

export const getUserBaseConfirmButton = (): ButtonModel => {
  return {id: 'Confirm', text: 'public.confirm', type: 'primary'}
}

export const getAlertManagementButton = (): ButtonModel => {
  return {id: 'AlertManagement', text: 'Go To Alert Management', type: 'primary'}
}

export const getDashboardButton = (): ButtonModel => {
  return {id: 'Dashboard', text: 'Go To Dashboard', type: 'secondary'}
}

export const getUserBaseDeleteConfirmButton = (): ButtonModel => {
  return {id: 'DeleteConfirm', text: 'public.confirm', type: 'primary'}
}
export const getUserBaseEditConfirmButton = (): ButtonModel => {
  return {id: 'Edit', text: 'public.edit', type: 'secondary'}
}
export const getUserBaseCancelButton = (): ButtonModel => {
  return {
    id: "Cancel",
    text: "public.cancel",
    type: "danger"
  }
}
//
