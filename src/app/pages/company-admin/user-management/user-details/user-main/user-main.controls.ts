import {TabModel} from "arb-design-library/model/tab.model";
import {ButtonModel} from "arb-design-library/model/button.model";
import {TitleModel} from "arb-design-library/model/title.model";
import {FormModel} from "../../../../../@core/model/dto/formModel";
import {ButtonControl} from "../../../../../@core/model/dto/control/button-control";
import {TextControl} from "../../../../../@core/model/dto/control/text-control";
import {EmptyControl} from "../../../../../@core/model/dto/control/empty-control";


export const getUserTitleModel = (): TitleModel => {
  return {
    id: ' UserManagment1',
    type: 'Page',
    title: "company-admin.users-list.title1",
    showArrow: true,
    stepper: {
      stepCounter: 1,
      stepText: 'public.step',
      ofText: 'public.of',
      steps: []
    }
  };
}
export const getEndButton = (): ButtonModel[] => {
  return [{
    id: "next",
    type: "primary",
    text: "public.next"
  }]
}
export const getStartButton = (): ButtonModel[] => {
  return [{
    id: "back",
    type: "secondary",
    text: "public.back"
  }]
}

export const getUserTabs = (): TabModel[] => {
  return [
    {text: "company-admin.user-details.UserInfo", value: "1"},
    {text: "company-admin.user-details.accounts", value: "2", icon: ""},
    {text: "company-admin.user-details.privileges", value: "3", icon: ""},
  ];
}
export const getUserEndButtons = (userDetails: any): ButtonModel[] => {
  return [
    {id: "restPassword", type: "secondary", text: "company-admin.user-details.restPassword"},
    {
      id: (userDetails && userDetails.companyUserDetails.userStatus === 'B') ? "unblock" : "block",
      type: "secondary",
      text: (userDetails && userDetails.companyUserDetails.userStatus === 'B') ?
        "company-admin.user-details.unblock" :
        "company-admin.user-details.block"
    },
    {id: "delete", type: "danger", text: "", prefixIcon: 'arb-icon-Trash'}
  ];
}
export const getEditButton = (): ButtonModel => {
  return {
    id: "edit",
    type: "secondary",
    text: "public.edit",
    prefixIcon: "arb-icon-edit",
  }
}

export const getUserSuccessStartButtons = (): ButtonModel[] => {
  return [
    {
      id: "goToHome",
      type: "secondary",
      text: "company-admin.user-info.go-to-dashboard",
    },
  ];
}
export const getUserSuccessEndButtons = (): ButtonModel[] => {
  return [
    {
      id: "userManagement",
      type: "primary",
      text: "company-admin.user-info.user-management",
    },
  ];
}

export const getDeleteForm = (): FormModel => {
  return new FormModel({
    id: "deleteForm",
    controls: {
      headerText: new TextControl({
        columnCount: 12,
        order: 1,
        label: "company-admin.user-info.delete-title",
        class: "text-center font-h1-bold justify-content-center"
      }),
      text: new TextControl({
        columnCount: 12,
        order: 1,
        label: "company-admin.user-info.delete-header",
        class: "text-center font-body-bold justify-content-center"
      }),
      empty: new EmptyControl({
        order: 2,
        columnCount: 12
      }),
      cancel: new ButtonControl({
        columnCount: 6,
        order: 2,
        label: "public.cancel",
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel",
        }

      }),
      delete: new ButtonControl({
        columnCount: 6,
        order: 3,
        label: "company-admin.user-info.delete-user",
        controlOptions: {
          id: "delete",
          type: 'danger',
          text: "company-admin.user-info.delete-user",
        }
      }),
    }
  })
}
export const getBlockForm = (): FormModel => {
  return new FormModel({
    id: "blockForm",
    controls: {
      headerText: new TextControl({
        columnCount: 12,
        order: 1,
        label: "company-admin.user-info.block-title",
        class: "text-center font-h1-bold justify-content-center"
      }),
      text: new TextControl({
        columnCount: 12,
        order: 1,
        label: "company-admin.user-info.block-header",
        class: "text-center font-body-bold justify-content-center"
      }),
      empty: new EmptyControl({
        order: 2,
        columnCount: 12
      }),
      cancel: new ButtonControl({
        columnCount: 6,
        order: 2,
        label: "public.cancel",
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel",
        }

      }),
      delete: new ButtonControl({
        columnCount: 6,
        order: 3,
        label: "company-admin.user-info.block-user",
        controlOptions: {
          id: "delete",
          type: 'danger',
          text: "company-admin.user-info.block-user",
        }
      }),
    }
  })
}
export const getResetForm = (): FormModel => {
  return new FormModel({
    id: "resetForm",
    controls: {
      headerText: new TextControl({
        columnCount: 12,
        order: 1,
        label: "company-admin.user-info.reset-title",
        class: "text-center font-h1-bold justify-content-center"
      }),
      text: new TextControl({
        columnCount: 12,
        order: 1,
        label: "company-admin.user-info.reset-header",
        class: "text-center font-body-bold justify-content-center"
      }),
      empty: new EmptyControl({
        order: 2,
        columnCount: 12
      }),
      cancel: new ButtonControl({
        columnCount: 6,
        order: 2,
        label: "public.cancel",
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel",
        }

      }),
      delete: new ButtonControl({
        columnCount: 6,
        order: 3,
        label: "company-admin.user-info.reset-user",
        controlOptions: {
          id: "delete",
          type: 'danger',
          text: "company-admin.user-info.reset-user",
        }
      }),
    }
  })
}
export const getUnBlockForm = (): FormModel => {
  return new FormModel({
    id: "unblockForm",
    controls: {
      headerText: new TextControl({
        columnCount: 12,
        order: 1,
        label: "company-admin.user-info.unblock-title",
        class: "text-center font-h1-bold justify-content-center"
      }),
      text: new TextControl({
        columnCount: 12,
        order: 1,
        label: "company-admin.user-info.unblock-header",
        class: "text-center font-body-bold justify-content-center"
      }),
      empty: new EmptyControl({
        order: 2,
        columnCount: 12
      }),
      cancel: new ButtonControl({
        columnCount: 6,
        order: 2,
        label: "public.cancel",
        controlOptions: {
          id: "cancel",
          type: 'secondary',
          text: "public.cancel",
        }

      }),
      delete: new ButtonControl({
        columnCount: 6,
        order: 3,
        label: "company-admin.user-info.unblock-user",
        controlOptions: {
          id: "delete",
          type: 'danger',
          text: "company-admin.user-info.unblock-user",
        }
      }),
    }
  })
}

export enum ExecutionType {
  ADD = "ADD", EDIT = "EDIT", VIEW = "VIEW"
}

//Operations
export const USER_BLOCK_OP_TYPE = 'BL'
export const USER_UNBLOCK_OP_TYPE = 'UB'
export const USER_DELETE_OP_TYPE = 'DL'
export const USER_RESET_PASSWORD_OP_TYPE = 'RP'
export const USER_MODIFY_OP_TYPE = 'MD'

export const USER_REGISTER_OP_TYPE = 'RG'
export const USER_DELETE_UNREGISTERED_OP_TYPE = 'DU'
export const USER_UNREGISTERED_OP_TYPE = 'UR'
