import { ProcedureStatusControl } from "app/@core/model/dto/control/procedure-status-control";
import { FormModel } from "app/@core/model/dto/formModel";


export function deleteForm() {
  return new FormModel({
    id: 'form',
    controls: {

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
          title: 'manage-alerts.successfullyDeleted',
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
          title: 'manage-alerts.errorDeleted',
          subTitle:'manage-alerts.tryAgain'
        }
      })
    }
  });
}
