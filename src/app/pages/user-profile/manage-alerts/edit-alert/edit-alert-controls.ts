import { DropdownControl } from "app/@core/model/dto/control/dropdown-control";
import { ProcedureStatusControl } from "app/@core/model/dto/control/procedure-status-control";
import { TextInputControl } from "app/@core/model/dto/control/text-input-control";
import { FormModel } from "app/@core/model/dto/formModel";


export function createForm() {
  return new FormModel({
    id: 'form',
    controls: {
      "account": new TextInputControl({
        label: 'manage-alerts.account',
        required: true,
        order: 2,
        columnCount: 4,
        value:""
      }),
      "phone": new TextInputControl({
        order: 2,
        columnCount: 4,
        label: "manage-alerts.phone",
        class: "text-start color-arb-primaryText",
        value: "",
      }),
      "language": new DropdownControl({
        label: 'manage-alerts.language',
        required: true,
        order: 2,
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
          title: 'manage-alerts.successfullyEdited',
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
          title: 'manage-alerts.errorEdited',
          subTitle:'manage-alerts.tryAgain'
        }
      })
    }
  });
}
