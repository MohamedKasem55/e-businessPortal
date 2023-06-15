import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { ProcedureStatusControl } from "app/@core/model/dto/control/procedure-status-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { TitleControl } from "app/@core/model/dto/control/title-control";
import { FormModel } from "app/@core/model/dto/formModel";


export function createForm() {
  return new FormModel({
    id: 'form',
    controls: {
      "alertTitle": new TitleControl({
        columnCount: 12,
        order: 1,
        controlOptions: {
          id: "",
          title: 'manage-alerts.alertList',
          type: 'Section',
        },
      }),
      "account": new DropdownControl({
        label: 'manage-alerts.account',
        required: true,
        order: 1,
        columnCount: 4,
        controlOptions: {
          columnId: "accountPk",
          textField: 'fullAccountNumber',
        },
        validationLabels: {
          required: 'manage-alerts.required',
        }
      }),
      "phone": new TextInputControl({
        order: 1,
        columnCount: 4,
        label: "manage-alerts.phone",
        class: "text-start color-arb-primaryText",
        value: "",
      }),
      "language": new DropdownControl({
        label: 'manage-alerts.language',
        required: true,
        order: 1,
        columnCount: 4,
        controlOptions: {
          columnId: "key",
          textField: 'value',
        },
        validationLabels: {
          required: 'manage-alerts.required',
        }
      }),
    }
  });
}

export function successForm() {
  return new FormModel({
    id: 'reasons',
    controls: {
      "status": new ProcedureStatusControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          type: 'Success',
          title: 'manage-alerts.successfully',
        }
      })
    }
  });
}

export function errorForm() {
  return new FormModel({
    id: 'reasons',
    controls: {
      "status": new ProcedureStatusControl({
        order: 1,
        columnCount: 12,
        controlOptions: {
          type: 'Error',
          title: 'manage-alerts.error',
          subTitle:'manage-alerts.tryAgain'
        }
      })
    }
  });
}
